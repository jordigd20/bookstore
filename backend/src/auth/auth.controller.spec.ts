import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn().mockImplementation((dto: CreateUserDto) => {
      const { password: _, ...rest } = dto;

      if (rest.email === 'duplicated@email.com') {
        throw new BadRequestException('Email already exists');
      }

      return {
        ...rest,
        id: 1,
        role: 'USER',
        createdAt: new Date(),
        token: 'token'
      };
    }),
    login: jest.fn().mockImplementation((dto: LoginUserDto) => {
      const user = mockUsers.find((user) => user.email === dto.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (dto.password !== user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { email } = user;
      return {
        id: 1,
        email,
        token: 'token'
      };
    })
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
      controllers: [AuthController],
      providers: [AuthService, { provide: AuthService, useValue: mockAuthService }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and generate a jwt token', () => {
      expect(controller.register(mockUserDto)).toEqual({
        id: expect.any(Number),
        firstName: mockUserDto.firstName,
        lastName: mockUserDto.lastName,
        email: mockUserDto.email,
        role: expect.any(String),
        createdAt: expect.any(Date),
        token: expect.any(String)
      });
    });

    it('should throw an error if email already exists', () => {
      expect(() =>
        controller.register({ ...mockUserDto, email: 'duplicated@email.com' })
      ).toThrowError(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return a user and generate a jwt token', () => {
      expect(controller.login(mockUserDto)).toEqual({
        id: expect.any(Number),
        email: mockUserDto.email,
        token: expect.any(String)
      });
    });

    it('should throw an error if email was not found', () => {
      expect(() => controller.login({ ...mockUserDto, email: 'notfound@email.com' })).toThrowError(
        UnauthorizedException
      );
    });

    it('should throw an error if password is not valid', () => {
      expect(() => controller.login({ ...mockUserDto, password: 'Invalid1234' })).toThrowError(
        UnauthorizedException
      );
    });
  });
});
