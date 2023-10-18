import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { AddBookToCartDto } from './dto/add-book-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  async addBookToCart(id: number, addBookToCartDto: AddBookToCartDto, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && authUser.cart.id !== id) {
      throw new ForbiddenException('You can only add books to your own cart');
    }

    try {
      const cart = await this.prisma.cart.update({
        where: { id },
        data: {
          books: {
            createMany: {
              data: addBookToCartDto.books
            }
          }
        },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      const total = cart.books.reduce((acc, curr) => {
        return acc + curr.quantity * Number(curr.book.currentPrice);
      }, 0);

      return {
        total: total.toString(),
        cart: cart.books
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOne(id: number, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && authUser.cart.id !== id) {
      throw new ForbiddenException('You can only get your own cart');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { id },
      select: {
        books: {
          select: {
            quantity: true,
            createdAt: true,
            updatedAt: true,
            book: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id: ${id} not found`);
    }

    const total = cart.books.reduce((acc, curr) => {
      return acc + curr.quantity * +curr.book.currentPrice;
    }, 0);

    console.log(total);

    return {
      total: total.toString(),
      cart: cart.books
    };
  }

  async updateBook(id: number, bookId: number, updateCartDto: UpdateCartDto, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && authUser.cart.id !== id) {
      throw new ForbiddenException('You can only update your own cart');
    }

    try {
      const cart = await this.prisma.cart.update({
        where: { id },
        data: {
          books: {
            updateMany: {
              where: {
                bookId
              },
              data: {
                quantity: updateCartDto.quantity
              }
            }
          }
        },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      const total = cart.books.reduce((acc, curr) => {
        return acc + curr.quantity * +curr.book.currentPrice;
      }, 0);

      return {
        total: total.toString(),
        cart: cart.books
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async removeBook(id: number, bookId: number, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && authUser.cart.id !== id) {
      throw new ForbiddenException('You can only remove books from your own cart');
    }

    try {
      const cart = await this.prisma.cart.update({
        where: { id },
        data: {
          books: {
            deleteMany: {
              bookId
            }
          }
        },
        select: {
          books: {
            select: {
              quantity: true,
              createdAt: true,
              updatedAt: true,
              book: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      const total = cart.books.reduce((acc, curr) => {
        return acc + curr.quantity * +curr.book.currentPrice;
      }, 0);

      return {
        total: total.toString(),
        cart: cart.books
      };
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
        throw new BadRequestException(
          'No cart or book record was found according to the provided id'
        );
      }
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
