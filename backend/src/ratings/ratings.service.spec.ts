import { Test, TestingModule } from '@nestjs/testing';
import { RatingsService } from './ratings.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from '../books/dto/create-book.dto';

describe('RatingsService', () => {
  let service: RatingsService;

  const mockPrismaService = {
    order: {
      findMany: jest.fn().mockImplementation(({ where }) => {
        return [{ id: 1 }];
      })
    },
    orderBook: {
      findMany: jest.fn().mockImplementation(({ where }) => {
        return [
          {
            book: {
              ...createBookDtoMock,
              id: 1,
              slug: 'title-of-the-book',
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date)
            }
          }
        ];
      }),
      count: jest.fn().mockImplementation(({ where }) => {
        return 1;
      })
    },
    ratingUserBook: {
      findMany: jest.fn().mockImplementation(({ where }) => {
        return [
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
        ];
      }),
      count: jest.fn().mockImplementation(({ where }) => {
        return 1;
      }),
      upsert: jest.fn().mockImplementation(({ where, create, update }) => {
        const { userId, bookId } = where.userId_bookId;

        if (userId === 0) {
        }

        return {
          book: {
            ...createBookDtoMock,
            id: 1,
            slug: 'title-of-the-book',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          },
          rating: '4.5'
        };
      })
    },
    $transaction: jest.fn().mockImplementation((args) => args)
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
      providers: [
        RatingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile();

    service = module.get<RatingsService>(RatingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNotRatedBooks', () => {
    it('should return an array of books not rated by the user', async () => {
      await expect(service.getNotRatedBooks(1, {})).resolves.toEqual({
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
      expect(mockPrismaService.order.findMany).toBeCalledWith({
        where: {
          userId: 1,
          status: 'COMPLETED'
        },
        select: {
          id: true
        }
      });
      expect(mockPrismaService.orderBook.findMany).toBeCalled();
      expect(mockPrismaService.orderBook.count).toBeCalled();
    });
  });

  describe('getRatedBooks', () => {
    it('should return an array of books rated by the user', async () => {
      await expect(service.getRatedBooks(1, {})).resolves.toEqual({
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
      expect(mockPrismaService.ratingUserBook.findMany).toBeCalled();
      expect(mockPrismaService.ratingUserBook.count).toBeCalled();
    });
  });

  describe('rateBook', () => {
    const rateBookDto = {
      bookId: 1,
      rating: 4.5
    };

    it('should rate a book', async () => {
      await expect(service.rateBook(1, rateBookDto)).resolves.toEqual({
        book: {
          ...createBookDtoMock,
          id: 1,
          slug: 'title-of-the-book',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        rating: '4.5'
      });
      expect(mockPrismaService.order.findMany).toBeCalledWith({
        where: {
          userId: 1,
          status: 'COMPLETED'
        },
        select: {
          id: true
        }
      });
      expect(mockPrismaService.orderBook.findMany).toBeCalled();
      expect(mockPrismaService.ratingUserBook.upsert).toBeCalled();
    });
  });
});
