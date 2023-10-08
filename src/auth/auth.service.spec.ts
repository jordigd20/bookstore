import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

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
          createdAt: new Date(),
          cart: { id: 2 },
          wishlist: { id: 3 }
        };
      }),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.hasOwnProperty('id')) {
          return {
            ...mockUsers[where.id],
            id: 1,
            role: 'USER',
            createdAt: new Date(),
            cart: { id: 2 },
            wishlist: { id: 3 },
            oauthProvider: 'LOCAL'
          };
        }

        const user = mockUsers.find((user) => user.email === where.email);

        if (!user) {
          return null;
        }

        return {
          ...user,
          id: 1,
          role: 'USER',
          createdAt: new Date(),
          cart: { id: 2 },
          wishlist: { id: 3 },
          oauthProvider: 'LOCAL'
        };
      })
    }
  };

  const mockJwtService = {
    sign: jest.fn().mockImplementation((payload: JwtPayload) => 'token'),
    verify: jest.fn().mockImplementation((token: string) => {
      if (token === 'invalid') {
        throw new UnauthorizedException('Invalid token');
      }

      return {
        id: 0
      };
    })
  };

  const mockStripeService = {
    stripe: {
      customers: {
        create: jest.fn()
      }
    }
  };

  const mockMailService = {};

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
        ConfigService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: StripeService, useValue: mockStripeService },
        { provide: MailService, useValue: mockMailService }
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
        cart: expect.any(Number),
        wishlist: expect.any(Number)
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
        user: {
          id: expect.any(Number),
          email: mockUserDto.email,
          firstName: mockUserDto.firstName,
          lastName: mockUserDto.lastName,
          role: expect.any(String),
          createdAt: expect.any(Date),
          cart: expect.any(Number),
          wishlist: expect.any(Number),
          oauthProvider: expect.any(String)
        },
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

  describe('refreshToken', () => {
    it('should return a user and generate a jwt token', async () => {
      for (const user of mockUsers) {
        user.password = await bcrypt.hash('Test1234', 10);
      }

      await expect(service.refreshToken('Bearer token')).resolves.toEqual({
        user: {
          id: expect.any(Number),
          email: mockUserDto.email,
          firstName: mockUserDto.firstName,
          lastName: mockUserDto.lastName,
          role: expect.any(String),
          createdAt: expect.any(Date),
          cart: expect.any(Number),
          wishlist: expect.any(Number),
          oauthProvider: expect.any(String)
        },
        token: expect.any(String)
      });
    });

    it('should throw an error if the token is invalid', async () => {
      await expect(service.refreshToken('invalid')).rejects.toThrowError(UnauthorizedException);
    });
  });
});
