import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn().mockImplementation((dto: PaginationDto) => {
      const { take = 10, skip = 0 } = dto;
      return mockUsers.slice(skip, take + skip);
    }),
    findOne: jest
      .fn()
      .mockImplementation((id: string, { includeAddress }: { includeAddress: boolean }) => {
        const { password, ...data } = mockUserDto;

        if (id !== '1') {
          throw new NotFoundException(`User with id or email: ${id} not found`);
        }

        const result = {
          id,
          ...data,
          role: 'USER',
          createdAt: new Date()
        };

        if (includeAddress) {
          result['addresses'] = [];
        }

        return result;
      }),
    update: jest.fn().mockImplementation((id: number, dto: CreateUserDto) => {
      const { password, ...data } = dto;

      if (id !== 1) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      if (password === 'invalid') {
        throw new BadRequestException('Invalid password');
      }

      return {
        id,
        ...data,
        role: 'USER',
        createdAt: new Date()
      };
    })
  };

  const mockUserDto: CreateUserDto = {
    email: 'test@email.com',
    password: 'Password1234',
    firstName: 'John',
    lastName: 'Doe'
  };

  const mockUsers: CreateUserDto[] = [
    mockUserDto,
    { ...mockUserDto, email: 'test2@email.com' },
    { ...mockUserDto, email: 'test3@email.com' },
    { ...mockUserDto, email: 'test4@email.com' },
    { ...mockUserDto, email: 'test5@email.com' }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      expect(controller.findAll({})).toEqual(mockUsers);
    });

    it('should return an array of users with pagination', () => {
      expect(controller.findAll({ take: 2, skip: 2 })).toEqual(mockUsers.slice(2, 4));
    });

    it('should return an empty array', () => {
      expect(controller.findAll({ take: 0, skip: 0 })).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find a user with an array of addresses', () => {
      expect(controller.findOne('1', { includeAddress: true })).toEqual({
        id: expect.any(String),
        email: mockUserDto.email,
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        role: 'USER',
        createdAt: expect.any(Date),
        addresses: []
      });
    });

    it('should find a user without addresses', () => {
      expect(controller.findOne('1', { includeAddress: false })).toEqual({
        id: expect.any(String),
        email: mockUserDto.email,
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        role: 'USER',
        createdAt: expect.any(Date)
      });
    });

    it('should throw an error when user is not found', () => {
      expect(() => controller.findOne('2', { includeAddress: false })).toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      expect(controller.update(1, mockUserDto)).toEqual({
        id: expect.any(Number),
        email: mockUserDto.email,
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        role: 'USER',
        createdAt: expect.any(Date)
      });
    });

    it('should throw an error when user is not found', () => {
      expect(() => controller.update(2, mockUserDto)).toThrowError(NotFoundException);
    });

    it('should throw an error when the password is invalid', () => {
      expect(() =>
        controller.update(1, {
          ...mockUserDto,
          password: 'invalid'
        })
      ).toThrowError(BadRequestException);
    });
  });
});
