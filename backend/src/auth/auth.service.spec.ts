import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      create: jest.fn().mockImplementation(({ data, include }) => {
        if (data.email === 'duplicated@email.com') {
          throw new PrismaClientKnownRequestError(
            'Unique constraint failed on the fields: (`email`)',
            {
              code: 'P2002',
              meta: {},
              clientVersion: '2.24.1'
            }
          );
        }

        return {
          ...data,
          id: 1,
          role: 'USER',
          createdAt: new Date()
        };
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        const user = mockUsers.find((user) => user.email === where.email);

        if (!user) {
          return null;
        }

        return {
          id: 1,
          email: user.email,
          password: user.password
        };
      })
    }
  };

  const mockJwtService = {
    sign: jest.fn().mockImplementation((payload: JwtPayload) => 'token')
  };

  const mockUserDto: CreateUserDto = {
    email: 'test@email.com',
    password: 'Test1234',
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
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and generate a jwt token', async () => {
      await expect(service.register(mockUserDto)).resolves.toEqual({
        id: expect.any(Number),
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        email: mockUserDto.email,
        role: expect.any(String),
        createdAt: expect.any(Date),
        token: expect.any(String)
      });
    });

    it('should throw an error if user already exists', async () => {
      await expect(
        service.register({ ...mockUserDto, email: 'duplicated@email.com' })
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return a user and generate a jwt token', async () => {
      for (const user of mockUsers) {
        user.password = await bcrypt.hash('Test1234', 10);
      }

      await expect(
        service.login({
          email: mockUserDto.email,
          password: 'Test1234'
        })
      ).resolves.toEqual({
        id: expect.any(Number),
        email: mockUserDto.email,
        token: expect.any(String)
      });
    });

    it('should throw an error if the user does not exist', async () => {
      await expect(
        service.login({
          email: 'invalid@email.com',
          password: 'Test1234'
        })
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an error if the password is invalid', async () => {
      await expect(
        service.login({
          email: 'test@email.com',
          password: 'Invalid1234'
        })
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
