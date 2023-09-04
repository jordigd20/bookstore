import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { RateBookDto } from './dto/rate-book.dto';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRatedBooks(id: number, paginationDto: PaginationDto) {
    try {
      const { take = 10, skip = 0 } = paginationDto;
      const [ratedBooks, total] = await this.prisma.$transaction([
        this.prisma.ratingUserBook.findMany({
          where: {
            userId: id
          },
          select: {
            book: true,
            rating: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take
        }),
        this.prisma.ratingUserBook.count({
          where: {
            userId: id
          }
        })
      ]);

      return {
        data: ratedBooks,
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

  async getNotRatedBooks(id: number, paginationDto: PaginationDto) {
    try {
      const { take = 10, skip = 0 } = paginationDto;
      const orders = await this.prisma.order.findMany({
        where: {
          userId: id,
          status: 'COMPLETED'
        },
        select: {
          id: true
        }
      });

      if (!orders) {
        return [];
      }

      const orderIds = orders.map((order) => order.id);
      const where = {
        orderId: { in: orderIds },
        AND: {
          book: {
            ratings: {
              none: {
                userId: id
              }
            }
          }
        }
      };

      const [booksFromOrders, total] = await this.prisma.$transaction([
        this.prisma.orderBook.findMany({
          where,
          select: {
            book: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take,
          skip
        }),
        this.prisma.orderBook.count({
          where
        })
      ]);

      return {
        data: booksFromOrders.map((book) => book.book),
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

  async rateBook(id: number, rateBookDto: RateBookDto) {
    const { bookId, rating } = rateBookDto;

    // Check if the book exists in one of the orders of the user
    const orders = await this.prisma.order.findMany({
      where: {
        userId: id,
        status: 'COMPLETED'
      },
      select: {
        id: true
      }
    });

    if (orders.length === 0) {
      throw new BadRequestException('There are no orders from this user');
    }

    const orderIds = orders.map((order) => order.id);
    const bookFromOrder = await this.prisma.orderBook.findMany({
      where: {
        orderId: {
          in: orderIds
        },
        bookId
      },
      select: {
        bookId: true
      }
    });

    if (bookFromOrder.length === 0) {
      throw new BadRequestException('The book is not in the orders of this user');
    }

    try {
      const ratedBook = await this.prisma.ratingUserBook.upsert({
        where: {
          userId_bookId: {
            userId: id,
            bookId
          }
        },
        update: {
          rating
        },
        create: {
          rating,
          book: {
            connect: {
              id: bookId
            }
          },
          user: {
            connect: {
              id
            }
          }
        },
        select: {
          book: true,
          rating: true
        }
      });

      return ratedBook;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  handleDBError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException('There is already an account with this email');
      }
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
