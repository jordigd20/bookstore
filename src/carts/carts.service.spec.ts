import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { CreateBookDto } from '../books/dto/create-book.dto';

describe('CartsService', () => {
  let service: CartsService;

  const mockAuthUser: AuthUser = {
    id: 1,
    email: 'johndoe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    cart: {
      id: 1
    }
  };

  const mockBook: CreateBookDto = {
    ISBN: '1234567890123',
    title: 'title of the book',
    description: 'description',
    author: 'author',
    publisher: 'publisher',
    publishedDate: new Date(),
    pageCount: 1,
    imageLink: 'imageLink',
    language: 'ES',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    categories: ['fiction-literature']
  };

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

        if (data.books.hasOwnProperty('createMany')) {
          return {
            books: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                quantity: data.books.createMany.data[0].quantity,
                book: mockBook
              }
            ]
          };
        }

        if (data.books.hasOwnProperty('updateMany')) {
          return {
            books: [
              {
                quantity: data.books.updateMany.data.quantity,
                createdAt: new Date(),
                updatedAt: new Date(),
                book: mockBook
              }
            ]
          };
        }

        // deleteMany
        return {
          books: [
            {
              createdAt: new Date(),
              updatedAt: new Date(),
              quantity: 1,
              book: mockBook
            }
          ]
        };
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 0) {
          return null;
        }

        return {
          books: [
            {
              createdAt: new Date(),
              updatedAt: new Date(),
              quantity: 1,
              book: mockBook
            }
          ]
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

    it('should add a book to the cart', async () => {
      expect(await service.addBookToCart(1, mockAddBookToCartDto, mockAuthUser)).toEqual({
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            quantity: mockAddBookToCartDto.books[0].quantity,
            book: {
              ...mockBook,
              publishedDate: expect.any(Date)
            }
          }
        ]
      });
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
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    });

    it('should throw an error if cart not found', () => {
      expect(
        service.addBookToCart(0, mockAddBookToCartDto, { ...mockAuthUser, cart: { id: 0 } })
      ).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.cart.update).toHaveBeenCalled();
    });

    it('should throw an error if a user tries to add a book to another user cart', () => {
      expect(
        service.addBookToCart(1, mockAddBookToCartDto, {
          ...mockAuthUser,
          cart: { id: 0 }
        })
      ).rejects.toThrowError(ForbiddenException);
      expect(mockPrismaService.cart.update).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cart', async () => {
      await expect(service.findOne(1, mockAuthUser)).resolves.toEqual({
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            quantity: expect.any(Number),
            book: {
              ...mockBook,
              publishedDate: expect.any(Date)
            }
          }
        ]
      });
      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    });

    it('should throw an error if cart not found', async () => {
      await expect(service.findOne(0, { ...mockAuthUser, cart: { id: 0 } })).rejects.toThrowError(
        NotFoundException
      );
      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 0 },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    });

    it('should throw an error if a user tries to get another user cart', async () => {
      await expect(service.findOne(1, { ...mockAuthUser, cart: { id: 0 } })).rejects.toThrowError(
        ForbiddenException
      );
      expect(mockPrismaService.cart.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    });
  });

  describe('updateBook', () => {
    it('should update a book in the cart', async () => {
      await expect(service.updateBook(1, 8, { quantity: 2 }, mockAuthUser)).resolves.toEqual({
        total: (mockBook.currentPrice * 2).toString(),
        cart: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            quantity: 2,
            book: {
              ...mockBook,
              publishedDate: expect.any(Date)
            }
          }
        ]
      });
      expect(mockPrismaService.cart.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          books: {
            updateMany: {
              where: {
                bookId: 8
              },
              data: {
                quantity: 2
              }
            }
          }
        },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    });

    it('should throw an error if cart not found', async () => {
      await expect(
        service.updateBook(0, 8, { quantity: 2 }, { ...mockAuthUser, cart: { id: 0 } })
      ).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.cart.update).toHaveBeenCalled();
    });

    it('should throw an error if a user tries to update a book in another user cart', async () => {
      await expect(
        service.updateBook(1, 8, { quantity: 2 }, { ...mockAuthUser, cart: { id: 0 } })
      ).rejects.toThrowError(ForbiddenException);
      expect(mockPrismaService.cart.update).toHaveBeenCalled();
    });
  });

  describe('removeBook', () => {
    it('should remove a book from the cart', async () => {
      await expect(service.removeBook(1, 8, mockAuthUser)).resolves.toEqual({
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            quantity: expect.any(Number),
            book: {
              ...mockBook,
              publishedDate: expect.any(Date)
            }
          }
        ]
      });
      expect(mockPrismaService.cart.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          books: {
            deleteMany: {
              bookId: 8
            }
          }
        },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    });

    it('should throw an error if cart not found', async () => {
      await expect(
        service.removeBook(0, 8, { ...mockAuthUser, cart: { id: 0 } })
      ).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.cart.update).toHaveBeenCalled();
    });

    it('should throw an error if a user tries to remove a book from another user cart', async () => {
      await expect(
        service.removeBook(1, 8, { ...mockAuthUser, cart: { id: 0 } })
      ).rejects.toThrowError(ForbiddenException);
      expect(mockPrismaService.cart.update).toHaveBeenCalled();
    });
  });
});
