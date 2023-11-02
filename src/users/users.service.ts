import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { WishlistBooksDto } from './dto/wishlist-books.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(paginationDto: PaginationDto) {
    const { take = 10, skip = 0 } = paginationDto;

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      },
      skip,
      take
    });
  }

  async findOne(term: string, findOneDto: FindOneUserDto, authUser: AuthUser) {
    const { includeAddress = false } = findOneDto;
    const where = {} as { id: number } | { email: string };

    if (!isNaN(+term)) {
      where['id'] = +term;
    } else {
      where['email'] = term;
    }

    if (
      authUser.role !== ValidRoles.admin &&
      ((where['id'] && where['id'] !== authUser.id) ||
        (where['email'] && where['email'] !== authUser.email))
    ) {
      throw new ForbiddenException('You can only get your own user');
    }

    const user = await this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        addresses: includeAddress,
        wishlist: true,
        cart: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with id or email: ${term} not found`);
    }

    return user;
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && id !== authUser.id) {
      throw new ForbiddenException('You can only update your own user');
    }

    try {
      const { firstName, lastName } = updateUserDto;

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim()
        },
        include: {
          cart: true,
          wishlist: true
        }
      });

      const { password: _, ...userData } = updatedUser;

      return {
        ...userData,
        wishlist: updatedUser.wishlist.id,
        cart: updatedUser.cart.id
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && id !== authUser.id) {
      throw new ForbiddenException('You can only update your own user');
    }

    if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
        oauthProvider: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    if (user.oauthProvider !== 'LOCAL') {
      throw new BadRequestException('This verification strategy is not valid for this account');
    }

    if (!bcrypt.compareSync(updatePasswordDto.currentPassword, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          password: bcrypt.hashSync(updatePasswordDto.newPassword, 10)
        }
      });

      return {
        message: 'Your password has been updated successfully',
        ok: true
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async getWishlist(id: number, paginationDto: PaginationDto, authUser: AuthUser) {
    const { take = 10, skip = 0 } = paginationDto;

    if (authUser.role !== ValidRoles.admin && id !== authUser.id) {
      throw new ForbiddenException('You can only get your own wishlist');
    }

    const wishlistedBooksFromUser = await this.prisma.user.findUnique({
      where: { id },
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
              skip,
              take
            }
          }
        }
      }
    });

    if (!wishlistedBooksFromUser) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    return wishlistedBooksFromUser.wishlist.books.map((book) => book.book);
  }

  async addToWishlist(id: number, wishlistBooksDto: WishlistBooksDto, authUser: AuthUser) {
    const { bookIds: booksToAdd } = wishlistBooksDto;

    if (authUser.role !== ValidRoles.admin && id !== authUser.id) {
      throw new ForbiddenException('You can only add books to your own wishlist');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    const userBooksId = user.wishlist.books.map((book) => book.bookId);

    if (booksToAdd.some((bookId) => userBooksId.includes(bookId))) {
      throw new BadRequestException('Some books are already in the wishlist');
    }

    try {
      const wishlistedBooks = await this.prisma.wishlist.update({
        where: { id: user.wishlist.id },
        data: {
          books: {
            createMany: {
              data: booksToAdd.map((bookId) => ({ bookId }))
            }
          }
        },
        select: {
          books: true
        }
      });

      return wishlistedBooks.books;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async removeFromWishlist(id: number, wishlistBooksDto: WishlistBooksDto, authUser: AuthUser) {
    const { bookIds: booksToRemove } = wishlistBooksDto;

    if (authUser.role !== ValidRoles.admin && id !== authUser.id) {
      throw new ForbiddenException('You can only remove books from your own wishlist');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    const userBooksId = user.wishlist.books.map((book) => book.bookId);

    if (booksToRemove.some((bookId) => !userBooksId.includes(bookId))) {
      throw new BadRequestException('Some books are not in the wishlist');
    }

    try {
      const wishlistedBooks = await this.prisma.wishlist.update({
        where: { id: user.wishlist.id },
        data: {
          books: {
            deleteMany: {
              bookId: {
                in: booksToRemove
              }
            }
          }
        },
        select: {
          books: true
        }
      });

      return wishlistedBooks.books;
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
