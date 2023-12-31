import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

describe('AddressesService', () => {
  let service: AddressesService;

  const addressDto: CreateAddressDto = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+31624123123',
    country: 'Spain',
    countryCode: 'ES',
    city: 'Madrid',
    province: 'Madrid',
    postalCode: '03690',
    address: 'C/Calle nº1 4ºD'
  };

  const mockAuthUser: AuthUser = {
    id: 1,
    email: 'johndoe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    cart: {
      id: 1
    }
  };

  const mockPrismaService = {
    address: {
      create: jest.fn().mockImplementation(({ data }) => {
        const { user, ...restOfData } = data;

        if (user.connect.id === 0) {
          throw new PrismaClientKnownRequestError(
            'An operation failed because it depends on one or more records that were required but not found.',
            {
              code: 'P2025',
              meta: {},
              clientVersion: '2.24.1'
            }
          );
        }

        return {
          ...restOfData,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1
        };
      }),
      findMany: jest.fn().mockImplementation(({ where, skip, take }) => {
        return [
          {
            ...addressDto,
            id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: 1
          }
        ];
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const { id } = where;

        if (id === 0) {
          throw new PrismaClientKnownRequestError(
            'An operation failed because it depends on one or more records that were required but not found.',
            {
              code: 'P2025',
              meta: {},
              clientVersion: '2.24.1'
            }
          );
        }

        if (id === -1) {
          return {
            ...data,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: -1
          };
        }

        return {
          ...data,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1
        };
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        const { id } = where;

        if (id === 0) {
          throw new PrismaClientKnownRequestError(
            'An operation failed because it depends on one or more records that were required but not found.',
            {
              code: 'P2025',
              meta: {},
              clientVersion: '2.24.1'
            }
          );
        }

        if (id === -1) {
          return {
            ...addressDto,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: -1
          };
        }

        return {
          ...addressDto,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1
        };
      })
    },
    $transaction: jest.fn().mockImplementation((callback) => callback(mockPrismaService))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an address', async () => {
      const userId = 1;

      expect(await service.create(userId, addressDto, mockAuthUser)).toEqual({
        ...addressDto,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: expect.any(Number)
      });
      expect(mockPrismaService.address.create).toHaveBeenCalledWith({
        data: {
          ...addressDto,
          user: { connect: { id: userId } }
        }
      });
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 0;

      await expect(
        service.create(userId, addressDto, { ...mockAuthUser, id: 0 })
      ).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.address.create).toHaveBeenCalledWith({
        data: {
          ...addressDto,
          user: { connect: { id: userId } }
        }
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of addresses', async () => {
      const paginationDto = { skip: 1, take: 10 };

      expect(await service.findAll(paginationDto)).toEqual([
        {
          ...addressDto,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          userId: expect.any(Number)
        }
      ]);
      expect(mockPrismaService.address.findMany).toHaveBeenCalledWith({
        skip: paginationDto.skip,
        take: paginationDto.take
      });
    });
  });

  describe('findOne', () => {
    it('should return an array of addresses', async () => {
      const userId = 1;

      expect(await service.findOne(userId, mockAuthUser)).toEqual([
        {
          ...addressDto,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          userId: expect.any(Number)
        }
      ]);
      expect(mockPrismaService.address.findMany).toHaveBeenCalledWith({
        where: { userId }
      });
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const id = 1;

      expect(await service.update(id, addressDto, mockAuthUser)).toEqual({
        ...addressDto,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: expect.any(Number)
      });
      expect(mockPrismaService.address.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          ...addressDto
        }
      });
    });

    it('should throw an error if the user does not exist', async () => {
      const id = 0;

      await expect(service.update(id, addressDto, mockAuthUser)).rejects.toThrowError(
        BadRequestException
      );
      expect(mockPrismaService.address.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          ...addressDto
        }
      });
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const id = -1;

      await expect(service.update(id, addressDto, mockAuthUser)).rejects.toThrowError(
        ForbiddenException
      );
      expect(mockPrismaService.address.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          ...addressDto
        }
      });
    });
  });

  describe('remove', () => {
    it('should remove an address', async () => {
      const id = 1;

      expect(await service.remove(id, mockAuthUser)).toEqual({
        message: 'Address deleted successfully',
        statusCode: 200
      });
      expect(mockPrismaService.address.delete).toHaveBeenCalledWith({
        where: { id }
      });
    });

    it('should throw an error if the address does not exist', async () => {
      const id = 0;

      await expect(service.remove(id, mockAuthUser)).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.address.delete).toHaveBeenCalledWith({
        where: { id }
      });
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const id = -1;

      await expect(service.remove(id, mockAuthUser)).rejects.toThrowError(ForbiddenException);
      expect(mockPrismaService.address.delete).toHaveBeenCalledWith({
        where: { id }
      });
    });
  });
});
