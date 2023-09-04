import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { CreateBookDto } from '../books/dto/create-book.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BadRequestException } from '@nestjs/common';

describe('RatingsController', () => {
  let controller: RatingsController;

  const mockRatingsService = {
    getNotRatedBooks: jest.fn().mockImplementation((id: number, pagination: PaginationDto) => {
      const { take = 10, skip = 0 } = pagination;
      return {
        data: [
          {
            ...createBookDtoMock,
            id: 1,
            slug: 'title-of-the-book',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        pagination: {
          skip,
          take,
          total: 1
        }
      };
    }),
    getRatedBooks: jest.fn().mockImplementation((id: number, pagination: PaginationDto) => {
      const { take = 10, skip = 0 } = pagination;
      return {
        data: [
          {
            book: {
              ...createBookDtoMock,
              id: 1,
              slug: 'title-of-the-book',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            rating: '4.5'
          }
        ],
        pagination: {
          skip,
          take,
          total: 1
        }
      };
    }),
    rateBook: jest
      .fn()
      .mockImplementation((id: number, { bookId, rating }: { bookId: number; rating: number }) => {
        if (id === 0) {
          throw new BadRequestException('There are no orders from this user');
        }

        if (bookId === 0) {
          throw new BadRequestException('The book is not in the orders of this user');
        }

        return {
          book: {
            ...createBookDtoMock,
            id: 1,
            slug: 'title-of-the-book',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          rating: rating.toString()
        };
      })
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
      controllers: [RatingsController],
      providers: [
        RatingsService,
        {
          provide: RatingsService,
          useValue: mockRatingsService
        }
      ]
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNotRatedBooks', () => {
    it('should return an array of books from the user', () => {
      expect(controller.getNotRatedBooks(1, {})).toEqual({
        data: [
          {
            ...createBookDtoMock,
            id: 1,
            slug: 'title-of-the-book',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }
        ],
        pagination: {
          skip: 0,
          take: 10,
          total: 1
        }
      });
      expect(mockRatingsService.getNotRatedBooks).toHaveBeenCalledWith(1, {});
    });
  });

  describe('getRatedBooks', () => {
    it('should return an array of the books rated by the user', () => {
      expect(controller.getRatedBooks(1, {})).toEqual({
        data: [
          {
            book: {
              ...createBookDtoMock,
              id: 1,
              slug: 'title-of-the-book',
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date)
            },
            rating: '4.5'
          }
        ],
        pagination: {
          skip: 0,
          take: 10,
          total: 1
        }
      });
      expect(mockRatingsService.getRatedBooks).toHaveBeenCalledWith(1, {});
    });
  });

  describe('rateBook', () => {
    it('should rate a book', () => {
      expect(controller.rateBook(1, { bookId: 1, rating: 4.5 })).toEqual({
        book: {
          ...createBookDtoMock,
          id: 1,
          slug: 'title-of-the-book',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        rating: '4.5'
      });
      expect(mockRatingsService.rateBook).toHaveBeenCalledWith(1, { bookId: 1, rating: 4.5 });
    });

    it('should throw an error when user is not found or does not have orders', () => {
      expect(() => controller.rateBook(0, { bookId: 1, rating: 4.5 })).toThrowError(
        BadRequestException
      );
      expect(mockRatingsService.rateBook).toHaveBeenCalledWith(0, { bookId: 1, rating: 4.5 });
    });

    it('should throw an error when the book is not in the orders of the user', () => {
      expect(() => controller.rateBook(1, { bookId: 0, rating: 4.5 })).toThrowError(
        BadRequestException
      );
      expect(mockRatingsService.rateBook).toHaveBeenCalledWith(1, { bookId: 0, rating: 4.5 });
    });
  });
});
