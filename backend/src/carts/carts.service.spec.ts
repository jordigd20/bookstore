import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartsService', () => {
  let service: CartsService;

  const mockPrismaService = {
    cart: {
      update: jest.fn().mockImplementation(({ where, data, select }) => {
        if (where.id === 0) {
          throw new PrismaClientKnownRequestError('Record to update not found or not visible: 0', {
            code: 'P2025',
            meta: {
              target: ['id']
            },
            clientVersion: '2.24.1'
          });
        }

        return {
          books: [
            {
              ...data.books.createMany.data[0],
              cartId: where.id,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        };
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 0) {
          return null;
        }

        return {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 2,
          books: [
            {
              quantity: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              cartId: 1,
              bookId: 8
            }
          ]
        };
      })
    },
    cartBook: {
      update: jest.fn().mockImplementation(({ where, data }) => {
        if (where.cartId_bookId.cartId === 0) {
          throw new PrismaClientKnownRequestError('Record to update not found or not visible: 0', {
            code: 'P2025',
            meta: {
              target: ['cartId']
            },
            clientVersion: '2.24.1'
          });
        }

        return {
          ...data,
          cartId: where.cartId_bookId.cartId,
          bookId: where.cartId_bookId.bookId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        if (where.cartId_bookId.cartId === 0) {
          throw new PrismaClientKnownRequestError('Record to update not found or not visible: 0', {
            code: 'P2025',
            meta: {
              target: ['cartId']
            },
            clientVersion: '2.24.1'
          });
        }

        if (where.cartId_bookId.bookId === 0) {
          throw new PrismaClientKnownRequestError('Record to update not found or not visible: 0', {
            code: 'P2025',
            meta: {
              target: ['cartId']
            },
            clientVersion: '2.24.1'
          });
        }

        return {
          message: 'Book removed successfully',
          statusCode: 200
        };
      })
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addBookToCart', () => {
    const mockAddBookToCartDto = {
      books: [
        {
          bookId: 8,
          quantity: 1
        }
      ]
    };

    it('should add a book to the cart', () => {
      expect(service.addBookToCart(1, mockAddBookToCartDto)).resolves.toEqual([
        {
          ...mockAddBookToCartDto.books[0],
          cartId: 1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockPrismaService.cart.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          books: {
            createMany: {
              data: mockAddBookToCartDto.books
            }
          }
        },
        select: {
          books: true
        }
      });
    });

    it('should throw an error if cart not found', () => {
      expect(service.addBookToCart(0, mockAddBookToCartDto)).rejects.toThrowError(
        BadRequestException
      );
      expect(mockPrismaService.cart.update).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cart', async () => {
      await expect(service.findOne(1)).resolves.toEqual({
        id: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: 2,
        books: [
          {
            quantity: 1,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            cartId: 1,
            bookId: 8
          }
        ]
      });
      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          books: true
        }
      });
    });

    it('should throw an error if cart not found', async () => {
      await expect(service.findOne(0)).rejects.toThrowError(NotFoundException);
      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 0 },
        include: {
          books: true
        }
      });
    });
  });

  describe('updateBook', () => {
    it('should update a book in the cart', async () => {
      await expect(service.updateBook(1, 8, { quantity: 2 })).resolves.toEqual({
        quantity: 2,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        cartId: 1,
        bookId: 8
      });
      expect(mockPrismaService.cartBook.update).toHaveBeenCalledWith({
        where: {
          cartId_bookId: {
            cartId: 1,
            bookId: 8
          }
        },
        data: {
          quantity: 2
        }
      });
    });

    it('should throw an error if cart not found', async () => {
      await expect(service.updateBook(0, 8, { quantity: 2 })).rejects.toThrowError(
        BadRequestException
      );
      expect(mockPrismaService.cartBook.update).toHaveBeenCalled();
    });
  });

  describe('removeBook', () => {
    it('should remove a book from the cart', async () => {
      await expect(service.removeBook(1, 8)).resolves.toEqual({
        message: 'Book removed successfully',
        statusCode: 200
      });
      expect(mockPrismaService.cartBook.delete).toHaveBeenCalledWith({
        where: {
          cartId_bookId: {
            cartId: 1,
            bookId: 8
          }
        }
      });
    });

    it('should throw an error if cart not found', async () => {
      await expect(service.removeBook(0, 8)).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.cartBook.delete).toHaveBeenCalled();
    });

    it('should throw an error if book not found', async () => {
      await expect(service.removeBook(1, 0)).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.cartBook.delete).toHaveBeenCalled();
    });
  });
});
