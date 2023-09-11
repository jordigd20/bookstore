import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createAddressDto: CreateAddressDto, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && userId !== authUser.id) {
      throw new ForbiddenException('You can only create an address for your own user');
    }

    try {
      const address = await this.prisma.address.create({
        data: {
          ...createAddressDto,
          firstName: createAddressDto.firstName.trim(),
          lastName: createAddressDto.lastName.trim(),
          address: createAddressDto.address.trim(),
          user: { connect: { id: userId } }
        }
      });

      return address;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { take = 10, skip = 0 } = paginationDto;
    return this.prisma.address.findMany({
      skip,
      take
    });
  }

  async findOne(userId: number, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && userId !== authUser.id) {
      throw new ForbiddenException('You can only get an address for your own user');
    }

    return this.prisma.address.findMany({
      where: { userId }
    });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, authUser: AuthUser) {
    try {
      const address = await this.prisma.$transaction(async (tx) => {
        const address = await tx.address.update({
          where: { id },
          data: {
            ...updateAddressDto,
            firstName: updateAddressDto.firstName.trim(),
            lastName: updateAddressDto.lastName.trim(),
            address: updateAddressDto.address.trim()
          }
        });

        if (authUser.role !== ValidRoles.admin && address.userId !== authUser.id) {
          throw new ForbiddenException('You can only update an address for your own user');
        }

        return address;
      });

      return address;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: number, authUser: AuthUser) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const address = await tx.address.delete({ where: { id } });

        if (authUser.role !== ValidRoles.admin && address.userId !== authUser.id) {
          throw new ForbiddenException('You can only delete an address for your own user');
        }

        return address;
      });

      return {
        message: 'Address deleted successfully',
        statusCode: 200
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  handleDBError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Invalid data provided');
      }
    }

    if (error instanceof ForbiddenException) {
      throw error;
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
