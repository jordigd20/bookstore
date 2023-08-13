import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SearchBookDto } from './dto/search-book.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const { averageRating = 0, ratingsCount = 0, ...restOfCreateBookDto } = createBookDto;

      const book = await this.prisma.book.create({
        data: {
          ...restOfCreateBookDto,
          averageRating,
          ratingsCount,
          slug: createBookDto.title.toLowerCase().replace(/ /g, '-'),
          categories: {
            connect: createBookDto.categories.map((category) => {
              return {
                slug: category
              };
            })
          }
        },
        include: {
          categories: true
        }
      });

      return book;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(searchBookDto: SearchBookDto) {
    const { skip = 0, take = 10, category, sort, price, filter, search } = searchBookDto;
    const query: Prisma.BookWhereInput = {};
    const orderBy: Prisma.BookOrderByWithRelationInput = {};

    if (category) {
      query.categories = {
        some: {
          slug: {
            equals: category
          }
        }
      };
    }

    if (price) {
      const [min, max] = price.split('-');

      if (!min || !max) {
        throw new BadRequestException("Price filter must be in format 'min-max'");
      }

      query.currentPrice = {
        gte: Number(min),
        lte: Number(max)
      };
    }

    if (filter) {
      const filters = filter.split('.');

      if (filters.includes('discounted')) {
        query.discount = {
          gt: 0
        };
      }

      if (filters.includes('bestseller')) {
        query.isBestseller = true;
      }
    }

    if (search) {
      query.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          author: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    if (sort) {
      const [sortField, sortDirection] = sort.split('.');
      const validSortDirections = ['asc', 'desc'];

      if (!validSortDirections.includes(sortDirection)) {
        throw new BadRequestException('Sort direction must be one of the following: asc, desc');
      }

      const orderByFields = {
        price: 'currentPrice',
        rating: 'averageRating',
        title: 'title',
        publishedDate: 'publishedDate'
      };

      orderBy[orderByFields[sortField]] = sortDirection;
    }

    try {
      const [books, total] = await this.prisma.$transaction([
        this.prisma.book.findMany({
          where: query,
          orderBy,
          skip,
          take,
          include: {
            categories: true
          }
        }),
        this.prisma.book.count({
          where: query
        })
      ]);

      return {
        data: books,
        pagination: {
          skip,
          take,
          total
        }
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOne(term: string) {
    const where: Prisma.BookWhereUniqueInput = {} as Prisma.BookWhereUniqueInput;

    if (!isNaN(Number(term))) {
      where.id = Number(term);
    } else {
      where.slug = term;
    }

    const book = await this.prisma.book.findUnique({
      where,
      include: { categories: true }
    });

    if (!book) {
      throw new NotFoundException(`Book with id or slug: ${term} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const data = { ...updateBookDto } as Prisma.BookUncheckedUpdateInput;

      if (updateBookDto.title) {
        data.slug = updateBookDto.title.toLowerCase().replace(/ /g, '-');
      }

      if (updateBookDto.categories) {
        data.categories = {
          set: updateBookDto.categories.map((category) => {
            return {
              slug: category
            };
          })
        };
      }

      const book = await this.prisma.book.update({
        where: { id },
        data,
        include: {
          categories: true
        }
      });

      return book;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.book.delete({ where: { id } });

      return {
        message: 'Book deleted successfully',
        statusCode: 200
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  findAllCategories(getCategoriesDto: GetCategoriesDto) {
    const { categories } = getCategoriesDto;

    if (categories) {
      return this.prisma.category.findMany({
        where: {
          slug: {
            in: categories.split('.')
          }
        }
      });
    }

    return this.prisma.category.findMany();
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const { slug, name, thumbnail } = createCategoryDto;

      const category = await this.prisma.category.create({
        data: {
          slug,
          name,
          thumbnail
        }
      });

      return category;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto
      });

      return category;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  handleDBError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `There is already an account with this ${error.meta.target[0]}`
        );
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(error.meta.cause ?? 'Invalid data provided');
      }
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
