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
      const book = await this.prisma.book.create({
        data: {
          ...createBookDto,
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
    const where = {};
    let orderBy = 'AVG(rub."rating") ASC';

    if (category) {
      where['categories'] = `c."slug" = '${category}'`;
    }

    if (price) {
      const [min, max] = price.split('-');

      if (!min || !max) {
        throw new BadRequestException("Price filter must be in format 'min-max'");
      }

      if (isNaN(Number(min)) || isNaN(Number(max))) {
        throw new BadRequestException('Price filter must be a number');
      }

      where['price'] = `b."currentPrice" >= ${min} AND b."currentPrice" <= ${max}`;
    }

    if (filter) {
      const filters = filter.split('.');

      if (filters.includes('discounted')) {
        where['discount'] = `b."discount" > 0`;
      }

      if (filters.includes('bestseller')) {
        where['isBestseller'] = `b."isBestseller" = true`;
      }
    }

    if (search) {
      where['search'] = `(b."title" ILIKE '%${search}%' OR b."author" ILIKE '%${search}%')`;
    }

    if (sort) {
      const [sortField, sortDirection] = sort.split('.');
      const validSortDirections = ['asc', 'desc'];

      if (!validSortDirections.includes(sortDirection)) {
        throw new BadRequestException('Sort direction must be one of the following: asc, desc');
      }

      const orderByFields = {
        price: 'b."currentPrice"',
        rating: 'AVG(rub."rating")',
        title: 'b."title"',
        publishedDate: 'b."publishedDate"'
      };

      if (!Object.keys(orderByFields).includes(sortField)) {
        throw new BadRequestException(
          `Sort field must be one of the following: ${Object.keys(orderByFields).join(', ')}`
        );
      }

      orderBy = `${orderByFields[sortField]} ${sortDirection.toUpperCase()}`;
    }

    try {
      const [books, total] = await this.prisma.$transaction([
        this.prisma.$queryRawUnsafe(`
          SELECT
            b.*,
            COALESCE(AVG(rub."rating"), 0) AS "averageRating",
            COUNT(rub."rating")::int AS "ratingsCount",
            json_agg(c.*) AS "categories"
          FROM
            "Book" b
          LEFT JOIN
            "RatingUserBook" rub ON rub."bookId" = b.id
          INNER JOIN
            "_BookToCategory" bc ON b.id = bc."A"
          INNER JOIN
            "Category" c ON c.id = bc."B"
          ${Object.keys(where).length > 0 ? `WHERE ${Object.values(where).join(' AND ')}` : ''}
          GROUP BY
            b.id
          ORDER BY
            ${orderBy}
          LIMIT
            ${take}
          OFFSET
            ${skip}
      `),
        this.prisma.$queryRawUnsafe(`
          SELECT
            COUNT(DISTINCT b.id)::int
          FROM
            "Book" b
          INNER JOIN
            "_BookToCategory" bc ON b.id = bc."A"
          INNER JOIN
            "Category" c ON c.id = bc."B"
          ${Object.keys(where).length > 0 ? `WHERE ${Object.values(where).join(' AND ')}` : ''}
      `)
      ]);

      return {
        data: books,
        pagination: {
          skip,
          take,
          total: total[0].count
        }
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOne(term: string) {
    const where: Prisma.BookWhereUniqueInput = {} as Prisma.BookWhereUniqueInput;
    const book: Prisma.BookWhereInput = {} as Prisma.BookWhereInput;

    if (!isNaN(Number(term))) {
      where.id = Number(term);
      book.id = Number(term);
    } else {
      where.slug = term;
      book.slug = term;
    }

    const bookFoundQuery = this.prisma.book.findUnique({
      where,
      include: {
        categories: true
      }
    });

    const ratingBookQuery = this.prisma.ratingUserBook.groupBy({
      by: ['bookId'],
      where: {
        book
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    const [bookFound, ratingBook] = await this.prisma.$transaction([
      bookFoundQuery,
      ratingBookQuery
    ]);

    if (!bookFound) {
      throw new NotFoundException(`Book with id or slug: ${term} not found`);
    }

    return {
      ...bookFound,
      averageRating: ratingBook[0]?._avg?.rating ?? 0,
      ratingsCount: ratingBook[0]?._count?.rating ?? 0
    };
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
        throw new BadRequestException(`There is already a book with this ${error.meta.target[0]}`);
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(error.meta.cause ?? 'Invalid data provided');
      }
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
