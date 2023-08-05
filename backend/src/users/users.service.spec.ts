import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn().mockImplementation(({ skip = 0, take = 10 }) => {
        return mockUsers.slice(skip, take + skip);
      }),
      findUnique: jest.fn().mockImplementation(({ where, select }) => {
        const { addresses } = select;
        if (where.hasOwnProperty('email')) {
          const user = mockUsers.find((user) => user.email === where.email);
          if (user) {
            delete user.password;
          }

          if (user && !addresses) {
            delete user.addresses;
          }

          return user;
        }

        const user = mockUsers.find((user) => user.id === where.id);

        if (user && !select.hasOwnProperty('password')) {
          delete user.password;
        }

        if (user && !addresses) {
          delete user.addresses;
        }

        return user;
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        const user = mockUsers.find((user) => user.id === where.id);
        return {
          ...user,
          ...data
        };
      })
    }
  };

  const mockUser = {
    id: 1,
    email: 'test@email.com',
    password: 'Test1234',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    createdAt: new Date(),
    addresses: []
  };

  const mockUsers = [
    mockUser,
    { ...mockUser, id: 2, email: 'test2@email.com' },
    { ...mockUser, id: 3, email: 'test3@email.com' },
    { ...mockUser, id: 4, email: 'test4@email.com' },
    { ...mockUser, id: 5, email: 'test5@email.com' }
  ];

  const mockUpdateUserDto = {
    firstName: 'Jane',
    lastName: 'Johnson',
    email: 'test@email.com',
    password: 'Test1234'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      expect(service.findAll({})).toEqual(mockUsers);
    });

    it('should return an array of users with pagination', () => {
      const paginationDto: PaginationDto = {
        take: 3,
        skip: 1
      };

      expect(service.findAll(paginationDto)).toEqual([mockUsers[1], mockUsers[2], mockUsers[3]]);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID with an array of addresses ', async () => {
      await expect(service.findOne('1', { includeAddress: true })).resolves.toEqual({
        id: 1,
        email: 'test@email.com',
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(Date),
        addresses: []
      });
    });

    it('should find a user by email with an array of addresses ', async () => {
      await expect(service.findOne('test3@email.com', { includeAddress: true })).resolves.toEqual({
        id: 3,
        email: 'test3@email.com',
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(Date),
        addresses: []
      });
    });

    it('should find a user by ID without an array of addresses ', async () => {
      await expect(service.findOne('1', { includeAddress: false })).resolves.toEqual({
        id: 1,
        email: 'test@email.com',
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(Date)
      });
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      await expect(service.findOne('20', { includeAddress: false })).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      for (const user of mockUsers) {
        user.password = await bcrypt.hash('Test1234', 10);
      }

      await expect(service.update(1, mockUpdateUserDto)).resolves.toEqual({
        id: 1,
        email: mockUpdateUserDto.email,
        firstName: mockUpdateUserDto.firstName,
        lastName: mockUpdateUserDto.lastName,
        createdAt: expect.any(Date),
        role: expect.any(String)
      });
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      await expect(service.update(20, mockUpdateUserDto)).rejects.toThrowError(NotFoundException);
    });

    it('should throw a BadRequestException if the password is not valid', async () => {
      await expect(
        service.update(1, { ...mockUpdateUserDto, password: 'test1234' })
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
