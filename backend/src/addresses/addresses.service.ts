import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createAddressDto: CreateAddressDto) {
    try {
      const { countryCode, ...rest } = createAddressDto;

      const address = await this.prisma.address.create({
        data: {
          ...rest,
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

  async findOne(userId: number) {
    return this.prisma.address.findMany({
      where: { userId }
    });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    try {
      const { countryCode, ...rest } = updateAddressDto;

      const address = await this.prisma.address.update({
        where: { id },
        data: {
          ...rest,
          firstName: updateAddressDto.firstName.trim(),
          lastName: updateAddressDto.lastName.trim(),
          address: updateAddressDto.address.trim()
        }
      });

      return address;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.address.delete({ where: { id } });

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

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
