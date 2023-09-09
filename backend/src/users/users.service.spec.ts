import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn().mockImplementation(({ skip = 0, take = 10 }) => {
        return mockUsers.slice(skip, take + skip);
      }),
      findUnique: jest.fn().mockImplementation(({ where, select }) => {
        const { addresses, wishlist } = select;

        if (wishlist && typeof wishlist === 'object' && where.id === 0) {
          return null;
        }

        if (wishlist && typeof wishlist === 'object' && wishlist.select.books.select.bookId) {
          return {
            wishlist: {
              books: [
                {
                  wishlistId: 1,
                  bookId: 1
                }
              ],
              id: 1
            }
          };
        }

        if (wishlist && typeof wishlist === 'object' && wishlist.select.books.select.book) {
          return {
            wishlist: {
              books: [
                {
                  book: {
                    ...createBookDtoMock,
                    id: 1,
                    slug: 'title-of-the-book',
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                  }
                }
              ]
            }
          };
        }

        if (where.hasOwnProperty('email')) {
          const user = mockUsers.find((user) => user.email === where.email);
          if (user) {
            delete user.password;
          }

          if (user && !addresses) {
            delete user.addresses;
          }

          return user;
        }

        const user = mockUsers.find((user) => user.id === where.id);

        if (user && !select.hasOwnProperty('password')) {
          delete user.password;
        }

        if (user && !addresses) {
          delete user.addresses;
        }

        return user;
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const user = mockUsers.find((user) => user.id === where.id);
        return {
          ...user,
          ...data
        };
      })
    },
    wishlist: {
      update: jest.fn().mockImplementation(({ where, data }) => {
        if (data.books.deleteMany) {
          return {
            books: [
              {
                id: new Date().getTime(),
                wishlistId: where.id,
                bookId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]
          };
        }

        const { data: bookIds } = data.books.createMany;

        return {
          books: bookIds.map((bookId) => ({
            id: new Date().getTime(),
            wishlistId: where.id,
            bookId: bookId.bookId,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        };
      })
    }
  };

  const mockUser = {
    id: 1,
    email: 'test@email.com',
    password: 'Test1234',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    createdAt: new Date(),
    addresses: []
  };

  const mockUsers = [
    mockUser,
    { ...mockUser, id: 2, email: 'test2@email.com' },
    { ...mockUser, id: 3, email: 'test3@email.com' },
    { ...mockUser, id: 4, email: 'test4@email.com' },
    { ...mockUser, id: 5, email: 'test5@email.com' }
  ];

  const mockAuthUser: AuthUser = {
    id: 1,
    email: 'test@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    cart: {
      id: 1
    }
  };

  const mockUpdateUserDto = {
    firstName: 'Jane',
    lastName: 'Johnson',
    email: 'test@email.com',
    password: 'Test1234'
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
      providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      expect(service.findAll({})).toEqual(mockUsers);
    });

    it('should return an array of users with pagination', () => {
      const paginationDto: PaginationDto = {
        take: 3,
        skip: 1
      };

      expect(service.findAll(paginationDto)).toEqual([mockUsers[1], mockUsers[2], mockUsers[3]]);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID with an array of addresses ', async () => {
      await expect(service.findOne('1', { includeAddress: true }, mockAuthUser)).resolves.toEqual({
        id: 1,
        email: 'test@email.com',
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(Date),
        addresses: []
      });
    });

    it('should find a user by email with an array of addresses', async () => {
      await expect(
        service.findOne(
          'test3@email.com',
          { includeAddress: true },
          { ...mockAuthUser, id: 3, email: 'test3@email.com' }
        )
      ).resolves.toEqual({
        id: 3,
        email: 'test3@email.com',
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(Date),
        addresses: []
      });
    });

    it('should find a user by ID without an array of addresses', async () => {
      await expect(service.findOne('1', { includeAddress: false }, mockAuthUser)).resolves.toEqual({
        id: 1,
        email: 'test@email.com',
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(Date)
      });
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      await expect(
        service.findOne('20', { includeAddress: false }, { ...mockAuthUser, id: 20 })
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ForbiddenException if the user is not admin and is trying to get another user', async () => {
      await expect(
        service.findOne('1', { includeAddress: false }, { ...mockAuthUser, id: 2 })
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      for (const user of mockUsers) {
        user.password = await bcrypt.hash('Test1234', 10);
      }

      await expect(service.update(1, mockUpdateUserDto, mockAuthUser)).resolves.toEqual({
        id: 1,
        email: mockUpdateUserDto.email,
        firstName: mockUpdateUserDto.firstName,
        lastName: mockUpdateUserDto.lastName,
        createdAt: expect.any(Date),
        role: expect.any(String)
      });
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      await expect(
        service.update(20, mockUpdateUserDto, { ...mockAuthUser, id: 20 })
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a BadRequestException if the password is not valid', async () => {
      await expect(
        service.update(1, { ...mockUpdateUserDto, password: 'test1234' }, mockAuthUser)
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw a ForbiddenException if the user is not admin and is trying to update another user', async () => {
      await expect(
        service.update(1, mockUpdateUserDto, { ...mockAuthUser, id: 2 })
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('getWishlist', () => {
    it('should return an array of books from the user wishlist', async () => {
      await expect(service.getWishlist(1, {}, mockAuthUser)).resolves.toEqual([
        {
          ...createBookDtoMock,
          id: 1,
          slug: 'title-of-the-book',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockPrismaService.user.findUnique).toBeCalledWith({
        where: { id: 1 },
        select: {
          wishlist: {
            select: {
              books: {
                select: {
                  book: true
                },
                orderBy: {
                  createdAt: 'desc'
                },
                skip: 0,
                take: 10
              }
            }
          }
        }
      });
    });

    it('should throw a ForbiddenException if the user is not admin and is trying to get another user wishlist', async () => {
      await expect(service.getWishlist(1, {}, { ...mockAuthUser, id: 2 })).rejects.toThrowError(
        ForbiddenException
      );
    });
  });

  describe('addToWishlist', () => {
    const wishlistBooksDto = {
      bookIds: [3]
    };

    it('should add a book to the user wishlist', async () => {
      await expect(service.addToWishlist(1, wishlistBooksDto, mockAuthUser)).resolves.toEqual([
        {
          id: expect.any(Number),
          wishlistId: 1,
          bookId: 3,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockPrismaService.user.findUnique).toBeCalledWith({
        where: { id: 1 },
        select: {
          wishlist: {
            select: {
              books: {
                select: {
                  bookId: true,
                  wishlistId: true
                }
              },
              id: true
            }
          }
        }
      });
      expect(mockPrismaService.wishlist.update).toBeCalledWith({
        where: { id: 1 },
        data: {
          books: {
            createMany: {
              data: [{ bookId: 3 }]
            }
          }
        },
        select: {
          books: true
        }
      });
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      await expect(
        service.addToWishlist(0, wishlistBooksDto, { ...mockAuthUser, id: 0 })
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ForbiddenException if the user is not admin and is trying to add a book to another user wishlist', async () => {
      await expect(
        service.addToWishlist(1, wishlistBooksDto, { ...mockAuthUser, id: 2 })
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('removeFromWishlist', () => {
    const wishlistBooksDto = {
      bookIds: [1]
    };

    it('should remove a book from the user wishlist', async () => {
      await expect(service.removeFromWishlist(1, wishlistBooksDto, mockAuthUser)).resolves.toEqual([
        {
          id: expect.any(Number),
          wishlistId: 1,
          bookId: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockPrismaService.user.findUnique).toBeCalledWith({
        where: { id: 1 },
        select: {
          wishlist: {
            select: {
              books: {
                select: {
                  bookId: true,
                  wishlistId: true
                }
              },
              id: true
            }
          }
        }
      });
      expect(mockPrismaService.wishlist.update).toBeCalledWith({
        where: { id: 1 },
        data: {
          books: {
            deleteMany: {
              bookId: {
                in: [1]
              }
            }
          }
        },
        select: {
          books: true
        }
      });
    });

    it('should throw a ForbiddenException if the user is not admin and is trying to remove a book from another user wishlist', async () => {
      await expect(
        service.removeFromWishlist(1, wishlistBooksDto, { ...mockAuthUser, id: 2 })
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
