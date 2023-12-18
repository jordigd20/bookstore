import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { CartBookEntity } from '../carts/entities/cart-book.entity';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockCartBook: CartBookEntity = {
    createdAt: new Date(),
    updatedAt: new Date(),
    quantity: 1,
    book: {
      id: 1,
      ISBN: '123456789',
      title: 'Book title',
      slug: 'book-title',
      author: 'Book author',
      publisher: 'Book publisher',
      publishedDate: new Date(),
      description: 'Book description',
      pageCount: 100,
      averageRating: 4,
      ratingsCount: 100,
      imageLink: 'http://image-link.com',
      language: 'EN',
      currentPrice: 19.99,
      originalPrice: 24.99,
      discount: 20,
      isBestseller: true,
      categories: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
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
  
  const mockOrdersService = {
    createStripeCheckoutSession: jest
      .fn()
      .mockImplementation((userId: number, checkoutDto: CheckoutDto, authUser: AuthUser) => {
        if (userId === 0) {
          throw new BadRequestException('Invalid user id');
        }

        if (userId !== authUser.id) {
          throw new ForbiddenException('You can only checkout your own cart');
        }

        if (checkoutDto.cartItems.length === 0) {
          throw new BadRequestException('You cannot checkout an empty cart');
        }

        if (checkoutDto.addressId === 0) {
          throw new BadRequestException('Invalid address id');
        }

        return {
          url: 'http://stripe.com/success',
          success_url: 'http://stripe.com/success',
          cancel_url: 'http://stripe.com/success'
        };
      }),
    create: jest.fn().mockImplementation((dto: CreateOrderDto) => {
      const { addressId, userId, receiptUrl } = dto;

      if (userId === 0) {
        throw new BadRequestException('Invalid user id');
      }

      if (addressId === 0) {
        throw new BadRequestException('Invalid address id');
      }

      return {
        id: new Date().getTime(),
        addressId,
        userId,
        receiptUrl,
        status: 'COMPLETED',
        total: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    findAllByUserId: jest
      .fn()
      .mockImplementation((userId: number, findOrdersDto: FindOrdersDto, authUser: AuthUser) => {
        if (userId === 0) {
          throw new BadRequestException('Invalid user id');
        }

        if (userId !== authUser.id) {
          throw new ForbiddenException('You can only find orders for your own user');
        }

        return [
          {
            id: 1,
            addressId: 1,
            userId: 1,
            receiptUrl: 'http://receipt-url.com',
            status: 'COMPLETED',
            total: 10,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }),
    findLastOrdersByUserId: jest.fn().mockImplementation((userId: number, authUser: AuthUser) => {
      if (userId === 0) {
        throw new BadRequestException('Invalid user id');
      }

      if (userId !== authUser.id) {
        throw new ForbiddenException('You can only find orders for your own user');
      }

      return {
        ordersByDate: {
          2023: [11, 12]
        },
        orders: [
          {
            id: 1,
            addressId: 1,
            userId: 1,
            receiptUrl: 'http://receipt-url.com',
            status: 'COMPLETED',
            total: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            books: []
          }
        ]
      };
    }),
    findOne: jest.fn().mockImplementation((id: number, authUser: AuthUser) => {
      if (id === 0) {
        throw new BadRequestException('Invalid order id');
      }

      return {
        id: 1,
        addressId: 1,
        userId: 1,
        receiptUrl: 'http://receipt-url.com',
        status: 'COMPLETED',
        total: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    update: jest.fn().mockImplementation((id: number, dto: CreateOrderDto) => {
      if (id === 0) {
        throw new BadRequestException('Invalid order id');
      }

      return {
        id: 1,
        addressId: 1,
        userId: 1,
        receiptUrl: 'http://receipt-url.com',
        status: 'COMPLETED',
        total: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
    remove: jest.fn().mockImplementation((id: number) => {
      if (id === 0) {
        throw new BadRequestException('Invalid order id');
      }

      return {
        status: 200,
        message: 'Order deleted successfully'
      };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService
        }
      ]
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('stripeCheckoutSession', () => {
    it('should create a stripe checkout session', async () => {
      const userId = 1;
      const checkoutDto: CheckoutDto = {
        cartItems: [
          {
            ...mockCartBook
          }
        ],
        addressId: 1
      };

      expect(controller.stripeCheckoutSession(userId, checkoutDto, mockAuthUser)).toEqual({
        url: 'http://stripe.com/success',
        success_url: 'http://stripe.com/success',
        cancel_url: 'http://stripe.com/success'
      });
      expect(mockOrdersService.createStripeCheckoutSession).toHaveBeenCalledWith(
        userId,
        checkoutDto,
        mockAuthUser
      );
    });

    it('should throw an error if the user id is invalid', async () => {
      const userId = 0;
      const checkoutDto: CheckoutDto = {
        cartItems: [
          {
            ...mockCartBook
          }
        ],
        addressId: 1
      };

      expect(() =>
        controller.stripeCheckoutSession(userId, checkoutDto, mockAuthUser)
      ).toThrowError(BadRequestException);
      expect(mockOrdersService.createStripeCheckoutSession).toHaveBeenCalledWith(
        userId,
        checkoutDto,
        mockAuthUser
      );
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const userId = 2;
      const checkoutDto: CheckoutDto = {
        cartItems: [
          {
            ...mockCartBook
          }
        ],
        addressId: 1
      };

      expect(() =>
        controller.stripeCheckoutSession(userId, checkoutDto, mockAuthUser)
      ).toThrowError(ForbiddenException);
      expect(mockOrdersService.createStripeCheckoutSession).toHaveBeenCalledWith(
        userId,
        checkoutDto,
        mockAuthUser
      );
    });

    it('should throw an error if the cart is empty', async () => {
      const userId = 1;
      const checkoutDto: CheckoutDto = {
        cartItems: [],
        addressId: 1
      };

      expect(() =>
        controller.stripeCheckoutSession(userId, checkoutDto, mockAuthUser)
      ).toThrowError(BadRequestException);
      expect(mockOrdersService.createStripeCheckoutSession).toHaveBeenCalledWith(
        userId,
        checkoutDto,
        mockAuthUser
      );
    });

    it('should throw an error if the address id is invalid', async () => {
      const userId = 1;
      const checkoutDto: CheckoutDto = {
        cartItems: [
          {
            ...mockCartBook
          }
        ],
        addressId: 0
      };

      expect(() =>
        controller.stripeCheckoutSession(userId, checkoutDto, mockAuthUser)
      ).toThrowError(BadRequestException);
      expect(mockOrdersService.createStripeCheckoutSession).toHaveBeenCalledWith(
        userId,
        checkoutDto,
        mockAuthUser
      );
    });
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        addressId: 1,
        receiptUrl: 'http://receipt-url.com'
      };

      expect(controller.create(createOrderDto)).toEqual({
        id: expect.any(Number),
        addressId: 1,
        userId: 1,
        receiptUrl: 'http://receipt-url.com',
        status: 'COMPLETED',
        total: 10,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
    });

    it('should throw an error if the user id is invalid', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 0,
        addressId: 1,
        receiptUrl: 'http://receipt-url.com'
      };

      expect(() => controller.create(createOrderDto)).toThrowError(BadRequestException);
      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
    });

    it('should throw an error if the address id is invalid', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        addressId: 0,
        receiptUrl: 'http://receipt-url.com'
      };

      expect(() => controller.create(createOrderDto)).toThrowError(BadRequestException);
      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAllByUserId', () => {
    it('should return an array of orders', async () => {
      const userId = 1;
      const findOrdersDto: FindOrdersDto = {
        month: 12,
        year: 2023
      };

      expect(controller.findAllByUserId(userId, findOrdersDto, mockAuthUser)).toEqual([
        {
          id: 1,
          addressId: 1,
          userId: 1,
          receiptUrl: 'http://receipt-url.com',
          status: 'COMPLETED',
          total: 10,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
      expect(mockOrdersService.findAllByUserId).toHaveBeenCalledWith(
        userId,
        findOrdersDto,
        mockAuthUser
      );
    });

    it('should throw an error if the user id is invalid', async () => {
      const userId = 0;
      const findOrdersDto: FindOrdersDto = {
        month: 12,
        year: 2023
      };

      expect(() => controller.findAllByUserId(userId, findOrdersDto, mockAuthUser)).toThrowError(
        BadRequestException
      );
      expect(mockOrdersService.findAllByUserId).toHaveBeenCalledWith(
        userId,
        findOrdersDto,
        mockAuthUser
      );
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const userId = 2;
      const findOrdersDto: FindOrdersDto = {
        month: 12,
        year: 2023
      };

      expect(() => controller.findAllByUserId(userId, findOrdersDto, mockAuthUser)).toThrowError(
        ForbiddenException
      );
      expect(mockOrdersService.findAllByUserId).toHaveBeenCalledWith(
        userId,
        findOrdersDto,
        mockAuthUser
      );
    });
  });

  describe('findLastOrdersByUserId', () => {
    it('should return the last orders of the user', async () => {
      const userId = 1;

      expect(controller.findLastOrdersByUserId(userId, mockAuthUser)).toEqual({
        ordersByDate: {
          2023: [11, 12]
        },
        orders: [
          {
            id: 1,
            addressId: 1,
            userId: 1,
            receiptUrl: 'http://receipt-url.com',
            status: 'COMPLETED',
            total: 10,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            books: []
          }
        ]
      });
      expect(mockOrdersService.findLastOrdersByUserId).toHaveBeenCalledWith(userId, mockAuthUser);
    });

    it('should throw an error if the user id is invalid', async () => {
      const userId = 0;

      expect(() => controller.findLastOrdersByUserId(userId, mockAuthUser)).toThrowError(
        BadRequestException
      );
      expect(mockOrdersService.findLastOrdersByUserId).toHaveBeenCalledWith(userId, mockAuthUser);
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const userId = 2;

      expect(() => controller.findLastOrdersByUserId(userId, mockAuthUser)).toThrowError(
        ForbiddenException
      );
      expect(mockOrdersService.findLastOrdersByUserId).toHaveBeenCalledWith(userId, mockAuthUser);
    });
  });

  describe('findOne', () => {
    it('should return an order', async () => {
      const id = 1;

      expect(controller.findOne(id, mockAuthUser)).toEqual({
        id: 1,
        addressId: 1,
        userId: 1,
        receiptUrl: 'http://receipt-url.com',
        status: 'COMPLETED',
        total: 10,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockOrdersService.findOne).toHaveBeenCalledWith(id, mockAuthUser);
    });

    it('should throw an error if the order id is invalid', async () => {
      const id = 0;

      expect(() => controller.findOne(id, mockAuthUser)).toThrowError(BadRequestException);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith(id, mockAuthUser);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const id = 1;
      const updateOrderDto: CreateOrderDto = {
        userId: 1,
        addressId: 1,
        receiptUrl: 'http://receipt-url.com'
      };

      expect(controller.update(id, updateOrderDto)).toEqual({
        id: 1,
        addressId: 1,
        userId: 1,
        receiptUrl: 'http://receipt-url.com',
        status: 'COMPLETED',
        total: 10,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockOrdersService.update).toHaveBeenCalledWith(id, updateOrderDto);
    });

    it('should throw an error if the order id is invalid', async () => {
      const id = 0;
      const updateOrderDto: CreateOrderDto = {
        userId: 1,
        addressId: 1,
        receiptUrl: 'http://receipt-url.com'
      };

      expect(() => controller.update(id, updateOrderDto)).toThrowError(BadRequestException);
      expect(mockOrdersService.update).toHaveBeenCalledWith(id, updateOrderDto);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const id = 1;

      expect(controller.remove(id)).toEqual({
        status: 200,
        message: 'Order deleted successfully'
      });
      expect(mockOrdersService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error if the order id is invalid', async () => {
      const id = 0;

      expect(() => controller.remove(id)).toThrowError(BadRequestException);
      expect(mockOrdersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
