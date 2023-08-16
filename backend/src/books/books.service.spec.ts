import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('BooksService', () => {
  let service: BooksService;

  const createBookDtoMock: CreateBookDto = {
    ISBN: '1234567890123',
    title: 'title of the book',
    description: 'description',
    author: 'author',
    publisher: 'publisher',
    publishedDate: new Date(),
    pageCount: 1,
    averageRating: 1,
    ratingsCount: 1,
    imageLink: 'imageLink',
    language: 'ES',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    categories: ['fiction-literature']
  };

  const createCategoryDtoMock: CreateCategoryDto = {
    slug: 'fiction-literature',
    name: 'Fiction & Literature',
    thumbnail: 'thumbnail'
  };

  const mockPrismaService = {
    book: {
      create: jest.fn().mockImplementation(({ data }) => {
        const { categories, ...restOfData } = data;

        if (restOfData.ISBN === '0000000000000') {
          throw new PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`ISBN`)',
            {
              code: 'P2002',
              meta: {
                target: ['ISBN']
              },
              clientVersion: '2.24.1'
            }
          );
        }

        return {
          ...restOfData,
          categories: [categories.connect[0].slug],
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }),
      findMany: jest.fn().mockReturnValueOnce({
        ...createBookDtoMock,
        id: 1,
        slug: 'title-of-the-book',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 0) {
          return null;
        }

        return {
          ...createBookDtoMock,
          id: 1,
          slug: 'title-of-the-book',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const { categories, ...restOfData } = data;

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
          ...restOfData,
          slug: 'new-title',
          categories: [categories.set[0].slug],
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
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
          message: 'Book deleted successfully',
          statusCode: 200
        };
      }),
      count: jest.fn().mockReturnValueOnce(1)
    },
    category: {
      findMany: jest.fn().mockReturnValueOnce([
        {
          ...createCategoryDtoMock,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]),
      create: jest.fn().mockImplementation(({ data }) => {
        const { slug, name, thumbnail } = data;

        if (slug === 'already-exists') {
          throw new PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`slug`)',
            {
              code: 'P2002',
              meta: {
                target: ['slug']
              },
              clientVersion: '2.24.1'
            }
          );
        }

        return {
          slug,
          name,
          thumbnail,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const { slug, name, thumbnail } = data;

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
          slug,
          name,
          thumbnail,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    },
    $transaction: jest.fn().mockImplementation((args) => args)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      expect(await service.create(createBookDtoMock)).toEqual({
        ...createBookDtoMock,
        id: expect.any(Number),
        slug: 'title-of-the-book',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockPrismaService.book.create).toHaveBeenCalledWith({
        data: {
          ...createBookDtoMock,
          slug: 'title-of-the-book',
          categories: {
            connect: [{ slug: 'fiction-literature' }]
          }
        },
        include: { categories: true }
      });
    });

    it('should throw an error if the book already exists', async () => {
      const errorDto = { ...createBookDtoMock };
      errorDto.ISBN = '0000000000000';

      await expect(service.create(errorDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return a list of books', async () => {
      expect(await service.findAll({})).toEqual({
        data: {
          ...createBookDtoMock,
          id: 1,
          slug: 'title-of-the-book',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        },
        pagination: {
          skip: 0,
          take: 10,
          total: expect.any(Number)
        }
      });
      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: {},
        include: { categories: true }
      });
    });
  });

  describe('findAllCategories', () => {
    it('should return an array of categories', async () => {
      expect(await service.findAllCategories({})).toEqual([
        {
          ...createCategoryDtoMock,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockPrismaService.category.findMany).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      expect(await service.createCategory(createCategoryDtoMock)).toEqual({
        ...createCategoryDtoMock,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: {
          ...createCategoryDtoMock
        }
      });
    });

    it('should throw an error if the category already exists', async () => {
      const errorDto = { ...createCategoryDtoMock };
      errorDto.slug = 'already-exists';

      await expect(service.createCategory(errorDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateCategory = { ...createCategoryDtoMock };
      updateCategory.slug = 'slug';

      expect(await service.updateCategory(1, updateCategory)).toEqual({
        ...updateCategory,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateCategory
        }
      });
    });

    it('should throw an error if the category does not exist', async () => {
      const updateCategory = { ...createCategoryDtoMock };
      updateCategory.slug = 'slug';

      await expect(service.updateCategory(0, updateCategory)).rejects.toThrowError(
        BadRequestException
      );
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      expect(await service.findOne('1')).toEqual({
        ...createBookDtoMock,
        id: 1,
        slug: 'title-of-the-book',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { categories: true }
      });
    });

    it('should throw an error if the book does not exist', async () => {
      await expect(service.findOne('0')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBook = { ...createBookDtoMock };
      updateBook.title = 'new title';

      expect(await service.update(1, updateBook)).toEqual({
        ...updateBook,
        id: 1,
        slug: 'new-title',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockPrismaService.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateBook,
          slug: 'new-title',
          categories: {
            set: [{ slug: 'fiction-literature' }]
          }
        },
        include: { categories: true }
      });
    });

    it('should throw an error if the book does not exist', async () => {
      const updateBook = { ...createBookDtoMock };
      updateBook.title = 'new title';

      await expect(service.update(0, updateBook)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      expect(await service.remove(1)).toEqual({
        message: 'Book deleted successfully',
        statusCode: 200
      });
      expect(mockPrismaService.book.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should throw an error if the book does not exist', async () => {
      await expect(service.remove(0)).rejects.toThrowError(BadRequestException);
    });
  });
});
