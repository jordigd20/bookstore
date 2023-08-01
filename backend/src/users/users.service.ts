import {
  BadRequestException,
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

  async findOne(term: string, findOneDto: FindOneUserDto) {
    const { includeAddress = false } = findOneDto;
    const where = {} as { id: number } | { email: string };

    if (!isNaN(+term)) {
      where['id'] = +term;
    } else {
      where['email'] = term;
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
        addresses: includeAddress
      }
    });

    if (!user) {
      throw new NotFoundException(`User with id or email: ${term} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: true
      }
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    if (!bcrypt.compareSync(updateUserDto.password, user.password)) {
      throw new BadRequestException('Invalid password');
    }

    try {
      const { password, email, firstName, lastName } = updateUserDto;

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          email: email.toLowerCase().trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim()
        }
      });

      const { password: _, ...userData } = updatedUser;

      return userData;
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
