import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { RateBookDto } from './dto/rate-book.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRatedBooks(userId: number, paginationDto: PaginationDto, authUser: AuthUser) {
    const { take = 10, skip = 0 } = paginationDto;

    if (authUser.role !== ValidRoles.admin && authUser.id !== userId) {
      throw new ForbiddenException('You can only see your own rated books');
    }

    try {
      const [ratedBooks, total] = await this.prisma.$transaction([
        this.prisma.ratingUserBook.findMany({
          where: {
            userId
          },
          select: {
            book: {
              include: {
                categories: true
              }
            },
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
            userId
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

  async getNotRatedBooks(userId: number, paginationDto: PaginationDto, authUser: AuthUser) {
    const { take = 10, skip = 0 } = paginationDto;

    if (authUser.role !== ValidRoles.admin && authUser.id !== userId) {
      throw new ForbiddenException('You can only see your own books without rating');
    }

    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId,
          status: 'COMPLETED'
        },
        select: {
          id: true
        }
      });

      if (!orders) {
        return {
          data: [],
          pagination: {
            skip,
            take,
            total: 0
          }
        };
      }

      const orderIds = orders.map((order) => order.id);
      const where = {
        orderId: { in: orderIds },
        AND: {
          book: {
            ratings: {
              none: {
                userId
              }
            }
          }
        }
      };

      const [booksFromOrders, total] = await this.prisma.$transaction([
        this.prisma.orderBook.findMany({
          where,
          select: {
            book: {
              include: {
                categories: true
              }
            }
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

  async rateBook(userId: number, rateBookDto: RateBookDto, authUser: AuthUser) {
    const { bookId, rating } = rateBookDto;

    if (authUser.role !== ValidRoles.admin && authUser.id !== userId) {
      throw new ForbiddenException('You can only rate your own books');
    }

    // Check if the book exists in one of the orders of the user
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
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
            userId,
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
              id: userId
            }
          }
        },
        select: {
          book: {
            include: {
              categories: true
            }
          },
          rating: true
        }
      });

      return ratedBook;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  updateRating(userId: number, rateBookDto: RateBookDto, authUser: AuthUser) {
    const { bookId, rating } = rateBookDto;

    if (authUser.role !== ValidRoles.admin && authUser.id !== userId) {
      throw new ForbiddenException('You can only rate your own books');
    }

    try {
      return this.prisma.ratingUserBook.update({
        where: {
          userId_bookId: {
            userId,
            bookId
          }
        },
        data: {
          rating
        },
        select: {
          book: {
            include: {
              categories: true
            }
          },
          rating: true
        }
      });
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
