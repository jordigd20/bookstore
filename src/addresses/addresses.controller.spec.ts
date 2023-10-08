import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

describe('AddressesController', () => {
  let controller: AddressesController;

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

  const mockAddressesService = {
    create: jest
      .fn()
      .mockImplementation((userId: number, dto: CreateAddressDto, authUser: AuthUser) => {
        if (userId === 0) {
          throw new BadRequestException('Invalid user id');
        }

        if (userId !== authUser.id) {
          throw new ForbiddenException('You can only create an address for your own user');
        }

        return {
          ...dto,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId
        };
      }),
    findAll: jest.fn().mockResolvedValueOnce([
      {
        ...addressDto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      }
    ]),
    findOne: jest.fn().mockImplementation((userId: number, authUser: AuthUser) => {
      if (userId !== authUser.id) {
        throw new ForbiddenException('You can only get an address for your own user');
      }

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
    update: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateAddressDto, authUser: AuthUser) => {
        if (id === 0) {
          throw new BadRequestException('Invalid address id');
        }

        

        return {
          ...addressDto,
          ...dto,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1
        };
      }),
    remove: jest.fn().mockImplementation((id: number, authUser: AuthUser) => {
      if (id === 0) {
        throw new BadRequestException('Invalid address id');
      }

      return {
        message: 'Address deleted successfully',
        statusCode: 200
      };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        {
          provide: AddressesService,
          useValue: mockAddressesService
        }
      ]
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an address', async () => {
      const userId = 1;

      expect(await controller.create(userId, addressDto, mockAuthUser)).toEqual({
        ...addressDto,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: expect.any(Number)
      });
      expect(mockAddressesService.create).toHaveBeenCalledWith(userId, addressDto, mockAuthUser);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 0;

      expect(() => controller.create(userId, addressDto, mockAuthUser)).toThrowError(
        BadRequestException
      );
      expect(mockAddressesService.create).toHaveBeenCalledWith(userId, addressDto, mockAuthUser);
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const userId = 2;

      expect(() => controller.create(userId, addressDto, mockAuthUser)).toThrowError(
        ForbiddenException
      );
      expect(mockAddressesService.create).toHaveBeenCalledWith(userId, addressDto, mockAuthUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of addresses', async () => {
      const paginationDto = { skip: 1, take: 10 };

      expect(await controller.findAll(paginationDto)).toEqual([
        {
          ...addressDto,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          userId: expect.any(Number)
        }
      ]);
      expect(mockAddressesService.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('should return an address', async () => {
      const userId = 1;

      expect(await controller.findOne(userId, mockAuthUser)).toEqual([
        {
          ...addressDto,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          userId: expect.any(Number)
        }
      ]);
      expect(mockAddressesService.findOne).toHaveBeenCalledWith(userId, mockAuthUser);
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const userId = 2;

      expect(() => controller.findOne(userId, mockAuthUser)).toThrowError(ForbiddenException);
      expect(mockAddressesService.findOne).toHaveBeenCalledWith(userId, mockAuthUser);
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const id = 1;
      const updateAddressDto: UpdateAddressDto = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+31624123123'
      };

      expect(await controller.update(id, updateAddressDto, mockAuthUser)).toEqual({
        ...addressDto,
        ...updateAddressDto,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: expect.any(Number)
      });
      expect(mockAddressesService.update).toHaveBeenCalledWith(id, updateAddressDto, mockAuthUser);
    });

    it('should throw an error if the address does not exist', async () => {
      const id = 0;

      expect(() => controller.update(id, {}, mockAuthUser)).toThrowError(BadRequestException);
      expect(mockAddressesService.update).toHaveBeenCalledWith(id, {}, mockAuthUser);
    });
  });

  describe('remove', () => {
    it('should remove an address', async () => {
      const id = 1;

      expect(await controller.remove(id, mockAuthUser)).toEqual({
        message: 'Address deleted successfully',
        statusCode: 200
      });
      expect(mockAddressesService.remove).toHaveBeenCalledWith(id, mockAuthUser);
    });

    it('should throw an error if the address does not exist', async () => {
      const id = 0;

      expect(() => controller.remove(id, mockAuthUser)).toThrowError(BadRequestException);
      expect(mockAddressesService.remove).toHaveBeenCalledWith(id, mockAuthUser);
    });
  });
});
