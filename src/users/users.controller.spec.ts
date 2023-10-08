import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { WishlistBooksDto } from './dto/wishlist-books.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn().mockImplementation((dto: PaginationDto) => {
      const { take = 10, skip = 0 } = dto;
      return mockUsers.slice(skip, take + skip);
    }),
    findOne: jest
      .fn()
      .mockImplementation((id: string, { includeAddress }: FindOneUserDto, authUser: AuthUser) => {
        const { password, ...data } = mockUserDto;

        if (id !== '1') {
          throw new NotFoundException(`User with id or email: ${id} not found`);
        }

        const result = {
          id,
          ...data,
          role: 'USER',
          createdAt: new Date()
        };

        if (includeAddress) {
          result['addresses'] = [];
        }

        return result;
      }),
    update: jest.fn().mockImplementation((id: number, dto: CreateUserDto, authUser: AuthUser) => {
      const { password, ...data } = dto;

      if (id !== 1) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      if (password === 'invalid') {
        throw new BadRequestException('Invalid password');
      }

      return {
        id,
        ...data,
        role: 'USER',
        createdAt: new Date()
      };
    }),
    getWishlist: jest.fn().mockImplementation((id: number, authUser: AuthUser) => {
      if (id === 0) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      return [
        {
          ...createBookDtoMock,
          id: 1,
          slug: 'title-of-the-book',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }),
    addToWishlist: jest
      .fn()
      .mockImplementation((id: number, wishlistBooksDto: WishlistBooksDto, authUser: AuthUser) => {
        const userBooks = [4, 5, 6];
        const { bookIds: booksToAdd } = wishlistBooksDto;

        if (id === 0) {
          throw new NotFoundException(`User with id: ${id} not found`);
        }

        if (booksToAdd.some((bookId) => userBooks.includes(bookId))) {
          throw new BadRequestException('Some books are already in the wishlist');
        }

        return [
          {
            id: 1,
            wishlistId: 2,
            bookId: 3,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }),
    removeFromWishlist: jest
      .fn()
      .mockImplementation((id: number, wishlistBooksDto: WishlistBooksDto, authUser: AuthUser) => {
        const userBooks = [2, 3];
        const { bookIds: booksToRemove } = wishlistBooksDto;

        if (id === 0) {
          throw new NotFoundException(`User with id: ${id} not found`);
        }

        if (booksToRemove.some((bookId) => !userBooks.includes(bookId))) {
          throw new BadRequestException('Some books are not in the wishlist');
        }

        return userBooks
          .filter((bookId) => !booksToRemove.includes(bookId))
          .map((bookId) => ({
            id: 1,
            wishlistId: 2,
            bookId,
            createdAt: new Date(),
            updatedAt: new Date()
          }));
      })
  };

  const mockUserDto: CreateUserDto = {
    email: 'test@email.com',
    password: 'Password1234',
    firstName: 'John',
    lastName: 'Doe'
  };

  const mockUsers: CreateUserDto[] = [
    mockUserDto,
    { ...mockUserDto, email: 'test2@email.com' },
    { ...mockUserDto, email: 'test3@email.com' },
    { ...mockUserDto, email: 'test4@email.com' },
    { ...mockUserDto, email: 'test5@email.com' }
  ];

  const mockAuthUser: AuthUser = {
    ...mockUserDto,
    id: 1,
    role: 'USER',
    cart: {
      id: 1
    }
  };

  const createBookDtoMock: CreateBookDto = {
    ISBN: '1234567890123',
    title: 'title of the book',
    description: 'description',
    author: 'author',
    publisher: 'publisher',
    publishedDate: new Date(),
    pageCount: 1,
    imageLink: 'imageLink',
    language: 'ES',
    isBestseller: false,
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    categories: ['fiction-literature']
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      expect(controller.findAll({})).toEqual(mockUsers);
    });

    it('should return an array of users with pagination', () => {
      expect(controller.findAll({ take: 2, skip: 2 })).toEqual(mockUsers.slice(2, 4));
    });

    it('should return an empty array', () => {
      expect(controller.findAll({ take: 0, skip: 0 })).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find a user with an array of addresses', () => {
      expect(controller.findOne('1', { includeAddress: true }, mockAuthUser)).toEqual({
        id: expect.any(String),
        email: mockUserDto.email,
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        role: 'USER',
        createdAt: expect.any(Date),
        addresses: []
      });
    });

    it('should find a user without addresses', () => {
      expect(controller.findOne('1', { includeAddress: false }, mockAuthUser)).toEqual({
        id: expect.any(String),
        email: mockUserDto.email,
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        role: 'USER',
        createdAt: expect.any(Date)
      });
    });

    it('should throw an error when user is not found', () => {
      expect(() => controller.findOne('2', { includeAddress: false }, mockAuthUser)).toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      expect(controller.update(1, mockUserDto, mockAuthUser)).toEqual({
        id: expect.any(Number),
        email: mockUserDto.email,
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        role: 'USER',
        createdAt: expect.any(Date)
      });
    });

    it('should throw an error when user is not found', () => {
      expect(() => controller.update(2, mockUserDto, mockAuthUser)).toThrowError(NotFoundException);
    });

    it('should throw an error when the password is invalid', () => {
      expect(() =>
        controller.update(
          1,
          {
            ...mockUserDto,
            password: 'invalid'
          },
          mockAuthUser
        )
      ).toThrowError(BadRequestException);
    });
  });

  describe('getWishlist', () => {
    it('should return an array of books from the user wishlist', () => {
      expect(controller.getWishlist(1, {}, mockAuthUser)).toEqual([
        {
          ...createBookDtoMock,
          id: 1,
          slug: 'title-of-the-book',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockUsersService.getWishlist).toHaveBeenCalledWith(1, {}, mockAuthUser);
    });

    it('should throw an error when user is not found', () => {
      expect(() => controller.getWishlist(0, {}, mockAuthUser)).toThrowError(NotFoundException);
      expect(mockUsersService.getWishlist).toHaveBeenCalledWith(0, {}, mockAuthUser);
    });
  });

  describe('addToWishlist', () => {
    const wishlistBooksDto = {
      bookIds: [3]
    };

    it('should add books to the user wishlist', () => {
      expect(controller.addToWishlist(1, wishlistBooksDto, mockAuthUser)).toEqual([
        {
          id: 1,
          wishlistId: 2,
          bookId: 3,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockUsersService.addToWishlist).toHaveBeenCalledWith(
        1,
        wishlistBooksDto,
        mockAuthUser
      );
    });

    it('should throw an error when user is not found', () => {
      expect(() => controller.addToWishlist(0, wishlistBooksDto, mockAuthUser)).toThrowError(
        NotFoundException
      );
      expect(mockUsersService.addToWishlist).toHaveBeenCalledWith(
        0,
        wishlistBooksDto,
        mockAuthUser
      );
    });

    it('should throw an error when some books are already in the wishlist', () => {
      expect(() => controller.addToWishlist(1, { bookIds: [4, 5] }, mockAuthUser)).toThrowError(
        BadRequestException
      );
      expect(mockUsersService.addToWishlist).toHaveBeenCalledWith(
        1,
        { bookIds: [4, 5] },
        mockAuthUser
      );
    });
  });

  describe('removeFromWishlist', () => {
    const wishlistBooksDto = {
      bookIds: [3]
    };
    it('should remove books from the user wishlist', () => {
      expect(controller.removeFromWishlist(1, wishlistBooksDto, mockAuthUser)).toEqual([
        {
          id: 1,
          wishlistId: 2,
          bookId: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
    });

    it('should throw an error when user is not found', () => {
      expect(() => controller.removeFromWishlist(0, wishlistBooksDto, mockAuthUser)).toThrowError(
        NotFoundException
      );
    });

    it('should throw an error if the book is not in the wishlist', () => {
      expect(() => controller.removeFromWishlist(1, { bookIds: [4] }, mockAuthUser)).toThrowError(
        BadRequestException
      );
    });
  });
});
