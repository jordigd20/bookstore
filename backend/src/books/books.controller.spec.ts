import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SearchBookDto } from './dto/search-book.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;

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

  const createCategoryDto: CreateCategoryDto = {
    slug: 'fiction-literature',
    name: 'Fiction & Literature'
  };

  const booksServiceMock = {
    create: jest.fn().mockImplementation((createBookDto: CreateBookDto) => {
      if (createBookDto.ISBN === '0000000000000') {
        throw new BadRequestException('There is already a book with this ISBN');
      }

      return {
        ...createBookDto,
        id: 1,
        slug: 'title-of-the-book',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    findAll: jest.fn().mockReturnValueOnce([
      {
        ...createBookDtoMock,
        id: 1,
        slug: 'title-of-the-book',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),
    findOne: jest.fn().mockImplementation((slug: string) => {
      if (slug === 'not-found') {
        throw new NotFoundException(`Book with slug: ${slug} not found`);
      }

      return {
        ...createBookDtoMock,
        id: 1,
        slug: 'title-of-the-book',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    findAllCategories: jest.fn().mockReturnValueOnce([
      {
        ...createCategoryDto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),
    createCategory: jest.fn().mockImplementation((createCategoryDto: CreateCategoryDto) => {
      if (createCategoryDto.slug === 'already-exists') {
        throw new BadRequestException('There is already a category with this slug');
      }

      return {
        ...createCategoryDto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    updateCategory: jest
      .fn()
      .mockImplementation((id: number, updateCategoryDto: UpdateCategoryDto) => {
        const category = { ...createCategoryDto };

        if (id === 0) {
          throw new BadRequestException(`Invalid category id: ${id}`);
        }

        if (updateCategoryDto.name) {
          category.name = updateCategoryDto.name;
        }

        if (updateCategoryDto.slug) {
          category.slug = updateCategoryDto.slug;
        }

        return {
          ...category,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }),
    update: jest.fn().mockImplementation((id: number, updateBookDto: UpdateBookDto) => {
      const book = { ...createBookDtoMock };

      if (id === 0) {
        throw new BadRequestException(`Invalid book id: ${id}`);
      }

      if (updateBookDto.title) {
        book.title = updateBookDto.title;
      }

      return {
        ...book,
        id: 1,
        slug: 'title-of-the-book',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    remove: jest.fn().mockImplementation((id: number) => {
      if (id === 0) {
        throw new BadRequestException(`Invalid book id: ${id}`);
      }

      return {
        status: 200,
        message: 'Book deleted successfully'
      };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: booksServiceMock
        }
      ]
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', () => {
      expect(controller.create(createBookDtoMock)).toEqual({
        ...createBookDtoMock,
        id: expect.any(Number),
        slug: 'title-of-the-book',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(booksServiceMock.create).toHaveBeenCalledWith(createBookDtoMock);
    });

    it('should throw an error if ISBN is already in use', () => {
      const errorBookDtoMock = { ...createBookDtoMock };
      errorBookDtoMock.ISBN = '0000000000000';

      expect(() => controller.create(errorBookDtoMock)).toThrowError(BadRequestException);
      expect(booksServiceMock.create).toHaveBeenCalledWith(errorBookDtoMock);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', () => {
      const searchBookDtoMock: SearchBookDto = {
        skip: 0,
        take: 10,
        search: 'title of the book'
      };

      expect(controller.findAll(searchBookDtoMock)).toEqual([
        {
          ...createBookDtoMock,
          id: expect.any(Number),
          slug: 'title-of-the-book',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(booksServiceMock.findAll).toHaveBeenCalledWith(searchBookDtoMock);
    });
  });

  describe('findAllCategories', () => {
    it('should return an array of categories', () => {
      expect(controller.findAllCategories({})).toEqual([
        {
          ...createCategoryDto,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(booksServiceMock.findAllCategories).toHaveBeenCalledWith({});
    });
  });

  describe('createCategory', () => {
    it('should create a category', () => {
      expect(controller.createCategory(createCategoryDto)).toEqual({
        ...createCategoryDto,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(booksServiceMock.createCategory).toHaveBeenCalledWith(createCategoryDto);
    });

    it('should throw an error if slug is already in use', () => {
      const errorCategoryDtoMock = { ...createCategoryDto };
      errorCategoryDtoMock.slug = 'already-exists';

      expect(() => controller.createCategory(errorCategoryDtoMock)).toThrowError(
        BadRequestException
      );
      expect(booksServiceMock.createCategory).toHaveBeenCalledWith(errorCategoryDtoMock);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', () => {
      const updateCategoryDto = { name: 'New name', slug: 'new-name' };

      expect(controller.updateCategory(1, updateCategoryDto)).toEqual({
        name: 'New name',
        slug: 'new-name',
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(booksServiceMock.updateCategory).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should throw an error if category is not found', () => {
      const updateCategoryDto = { name: 'New name', slug: 'new-name' };

      expect(() => controller.updateCategory(0, updateCategoryDto)).toThrowError(
        BadRequestException
      );
      expect(booksServiceMock.updateCategory).toHaveBeenCalledWith(0, updateCategoryDto);
    });
  });

  describe('findOne', () => {
    it('should return a book', () => {
      expect(controller.findOne('title-of-the-book')).toEqual({
        ...createBookDtoMock,
        id: expect.any(Number),
        slug: 'title-of-the-book',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(booksServiceMock.findOne).toHaveBeenCalledWith('title-of-the-book');
    });

    it('should throw an error if book is not found', () => {
      expect(() => controller.findOne('not-found')).toThrowError(NotFoundException);
      expect(booksServiceMock.findOne).toHaveBeenCalledWith('not-found');
    });
  });

  describe('update', () => {
    it('should update a book', () => {
      const updateBookDtoMock: UpdateBookDto = { title: 'New title' };

      expect(controller.update(1, updateBookDtoMock)).toEqual({
        ...createBookDtoMock,
        ...updateBookDtoMock,
        id: expect.any(Number),
        slug: 'title-of-the-book',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(booksServiceMock.update).toHaveBeenCalledWith(1, updateBookDtoMock);
    });

    it('should throw an error if book is not found', () => {
      const updateBookDtoMock: UpdateBookDto = { title: 'New title' };

      expect(() => controller.update(0, updateBookDtoMock)).toThrowError(BadRequestException);
      expect(booksServiceMock.update).toHaveBeenCalledWith(0, updateBookDtoMock);
    });
  });

  describe('remove', () => {
    it('should remove a book', () => {
      expect(controller.remove(1)).toEqual({
        status: 200,
        message: 'Book deleted successfully'
      });
      expect(booksServiceMock.remove).toHaveBeenCalledWith(1);
    });
  });
});
