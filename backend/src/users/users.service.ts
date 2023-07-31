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

  async findOne(id: number, findOneDto: FindOneUserDto) {
    const { includeAddress = false } = findOneDto;

    const user = await this.prisma.user.findUnique({
      where: { id },
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
      throw new NotFoundException(`User with id or email: ${id} not found`);
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

    const isPasswordValid = bcrypt.compareSync(updateUserDto.password, user.password);

    if (isPasswordValid) {
      try {
        const { password, ...data } = updateUserDto;

        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: { ...data }
        });

        const { password: _, ...userData } = updatedUser;

        return userData;
      } catch (error) {
        this.handleDBError(error);
      }
    }

    throw new BadRequestException('Invalid password');
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
