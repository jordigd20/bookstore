import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { CreateBookDto } from '../books/dto/create-book.dto';

describe('CartsController', () => {
  let controller: CartsController;

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

  const mockCartsService = {
    addBookToCart: jest.fn().mockImplementation((id, addBookToCartDto, authUser: AuthUser) => {
      if (id === 0) {
        throw new BadRequestException('Cart with id: 0 not found');
      }

      if (id !== authUser.cart.id) {
        throw new ForbiddenException('You can only add books to your own cart');
      }

      return [
        {
          total: mockBook.currentPrice.toString(),
          cart: [
            {
              quantity: addBookToCartDto.books[0].quantity,
              createdAt: new Date(),
              updatedAt: new Date(),
              book: mockBook
            }
          ]
        }
      ];
    }),
    findOne: jest.fn().mockImplementation((id, authUser: AuthUser) => {
      if (id === 0) {
        throw new NotFoundException(`Cart with id: ${id} not found`);
      }

      if (id !== authUser.cart.id) {
        throw new ForbiddenException('You can only get your own cart');
      }

      return {
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            book: mockBook
          }
        ]
      };
    }),
    updateBook: jest.fn().mockImplementation((id, bookId, updateCartDto, authUser: AuthUser) => {
      if (id === 0) {
        throw new BadRequestException('Cart with id: 0 not found');
      }

      if (id !== authUser.cart.id) {
        throw new ForbiddenException('You can only update your own cart');
      }

      return {
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            quantity: updateCartDto.quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
            book: mockBook
          }
        ]
      };
    }),
    removeBook: jest.fn().mockImplementation((id, bookId, authUser: AuthUser) => {
      if (id === 0) {
        throw new BadRequestException('Cart with id: 0 not found');
      }

      if (id !== authUser.cart.id) {
        throw new ForbiddenException('You can only remove books from your own cart');
      }

      return {
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            book: mockBook
          }
        ]
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
      expect(controller.addBookToCart(1, mockAddBookToCartDto, mockAuthUser)).toEqual([
        {
          total: mockBook.currentPrice.toString(),
          cart: [
            {
              quantity: mockAddBookToCartDto.books[0].quantity,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              book: mockBook
            }
          ]
        }
      ]);
      expect(mockCartsService.addBookToCart).toHaveBeenCalledWith(
        1,
        mockAddBookToCartDto,
        mockAuthUser
      );
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.addBookToCart(0, mockAddBookToCartDto, mockAuthUser)).toThrowError(
        BadRequestException
      );
      expect(mockCartsService.addBookToCart).toHaveBeenCalledWith(
        0,
        mockAddBookToCartDto,
        mockAuthUser
      );
    });

    it('should throw an error if user tries to add book to another user cart', () => {
      expect(() =>
        controller.addBookToCart(1, mockAddBookToCartDto, {
          ...mockAuthUser,
          cart: {
            id: 2
          }
        })
      ).toThrowError(ForbiddenException);
      expect(mockCartsService.addBookToCart).toHaveBeenCalledWith(1, mockAddBookToCartDto, {
        ...mockAuthUser,
        cart: {
          id: 2
        }
      });
    });
  });

  describe('findOne', () => {
    it('should return a cart', () => {
      expect(controller.findOne(1, mockAuthUser)).toEqual({
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            quantity: 1,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            book: mockBook
          }
        ]
      });
      expect(mockCartsService.findOne).toHaveBeenCalledWith(1, mockAuthUser);
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.findOne(0, mockAuthUser)).toThrowError(NotFoundException);
      expect(mockCartsService.findOne).toHaveBeenCalledWith(0, mockAuthUser);
    });

    it('should throw an error if user tries to get another user cart', () => {
      expect(() =>
        controller.findOne(1, {
          ...mockAuthUser,
          cart: {
            id: 2
          }
        })
      ).toThrowError(ForbiddenException);
      expect(mockCartsService.findOne).toHaveBeenCalledWith(1, {
        ...mockAuthUser,
        cart: {
          id: 2
        }
      });
    });
  });

  describe('updateBook', () => {
    const mockUpdateCartDto = {
      quantity: 2
    };

    it('should update a book in the cart', () => {
      expect(controller.updateBook(1, 8, mockUpdateCartDto, mockAuthUser)).toEqual({
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            quantity: mockUpdateCartDto.quantity,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            book: mockBook
          }
        ]
      });
      expect(mockCartsService.updateBook).toHaveBeenCalledWith(
        1,
        8,
        mockUpdateCartDto,
        mockAuthUser
      );
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.updateBook(0, 8, mockUpdateCartDto, mockAuthUser)).toThrowError(
        BadRequestException
      );
      expect(mockCartsService.updateBook).toHaveBeenCalledWith(
        0,
        8,
        mockUpdateCartDto,
        mockAuthUser
      );
    });

    it('should throw an error if user tries to update book in another user cart', () => {
      expect(() =>
        controller.updateBook(1, 8, mockUpdateCartDto, {
          ...mockAuthUser,
          cart: {
            id: 2
          }
        })
      ).toThrowError(ForbiddenException);
      expect(mockCartsService.updateBook).toHaveBeenCalledWith(1, 8, mockUpdateCartDto, {
        ...mockAuthUser,
        cart: {
          id: 2
        }
      });
    });
  });

  describe('removeBook', () => {
    it('should remove a book from the cart', () => {
      expect(controller.removeBook(1, 8, mockAuthUser)).toEqual({
        total: mockBook.currentPrice.toString(),
        cart: [
          {
            quantity: 1,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            book: mockBook
          }
        ]
      });
      expect(mockCartsService.removeBook).toHaveBeenCalledWith(1, 8, mockAuthUser);
    });

    it('should throw an error if cart not found', () => {
      expect(() => controller.removeBook(0, 8, mockAuthUser)).toThrowError(BadRequestException);
      expect(mockCartsService.removeBook).toHaveBeenCalledWith(0, 8, mockAuthUser);
    });

    it('should throw an error if user tries to remove book from another user cart', () => {
      expect(() =>
        controller.removeBook(1, 8, {
          ...mockAuthUser,
          cart: {
            id: 2
          }
        })
      ).toThrowError(ForbiddenException);
      expect(mockCartsService.removeBook).toHaveBeenCalledWith(1, 8, {
        ...mockAuthUser,
        cart: {
          id: 2
        }
      });
    });
  });
});
