import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartsController', () => {
  let controller: CartsController;

  const mockCartsService = {
    addBookToCart: jest.fn().mockImplementation((id, addBookToCartDto) => {
      if (id === 0) {
        throw new BadRequestException('Cart with id: 0 not found');
      }

      return [
        {
          ...addBookToCartDto.books[0],
          cartId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }),
    findOne: jest.fn().mockImplementation((id) => {
      if (id === 0) {
        throw new NotFoundException(`Cart with id: ${id} not found`);
      }

      return {
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
        books: [
          {
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            cartId: id,
            bookId: 8
          }
        ]
      };
    }),
    updateBook: jest.fn().mockImplementation((id, bookId, updateCartDto) => {
      if (id === 0) {
        throw new BadRequestException('Cart with id: 0 not found');
      }

      return {
        ...updateCartDto,
        cartId: id,
        bookId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    removeBook: jest.fn().mockImplementation((id, bookId) => {
      if (id === 0) {
        throw new BadRequestException('Cart with id: 0 not found');
      }

      return {
        message: 'Book removed successfully',
        statusCode: 200
      };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        CartsService,
        {
          provide: CartsService,
          useValue: mockCartsService
        }
      ]
    }).compile();

    controller = module.get<CartsController>(CartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      expect(controller.addBookToCart(1, mockAddBookToCartDto)).toEqual([
        {
          quantity: 1,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          cartId: 1,
          bookId: 8
        }
      ]);
      expect(mockCartsService.addBookToCart).toHaveBeenCalledWith(1, mockAddBookToCartDto);
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.addBookToCart(0, mockAddBookToCartDto)).toThrowError(
        BadRequestException
      );
      expect(mockCartsService.addBookToCart).toHaveBeenCalledWith(0, mockAddBookToCartDto);
    });
  });

  describe('findOne', () => {
    it('should return a cart', () => {
      expect(controller.findOne(1)).toEqual({
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
      expect(mockCartsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.findOne(0)).toThrowError(NotFoundException);
      expect(mockCartsService.findOne).toHaveBeenCalledWith(0);
    });
  });

  describe('updateBook', () => {
    const mockUpdateCartDto = {
      quantity: 2
    };

    it('should update a book in the cart', () => {
      expect(controller.updateBook(1, 8, mockUpdateCartDto)).toEqual({
        quantity: 2,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        cartId: 1,
        bookId: 8
      });
      expect(mockCartsService.updateBook).toHaveBeenCalledWith(1, 8, mockUpdateCartDto);
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.updateBook(0, 8, mockUpdateCartDto)).toThrowError(
        BadRequestException
      );
      expect(mockCartsService.updateBook).toHaveBeenCalledWith(0, 8, mockUpdateCartDto);
    });
  });

  describe('removeBook', () => {
    it('should remove a book from the cart', () => {
      expect(controller.removeBook(1, 8)).toEqual({
        message: 'Book removed successfully',
        statusCode: 200
      });
      expect(mockCartsService.removeBook).toHaveBeenCalledWith(1, 8);
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.removeBook(0, 8)).toThrowError(BadRequestException);
      expect(mockCartsService.removeBook).toHaveBeenCalledWith(0, 8);
    });
  });
});
