import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { StripeService } from '../stripe/stripe.service';
import { PrismaService } from '../prisma/prisma.service';
import { CartBookEntity } from '../carts/entities/cart-book.entity';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

describe('OrdersService', () => {
  let service: OrdersService;

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
      currentPrice: 10,
      originalPrice: 25,
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

  const mockStripeService = {
    stripe: {
      checkout: {
        sessions: {
          create: jest.fn().mockImplementation((data: any) => {
            return {
              url: 'https://stripe.com/checkout',
              success_url: 'https://stripe.com/success',
              cancel_url: 'https://stripe.com/cancel'
            };
          })
        }
      }
    }
  };

  const mockPrismaService = {
    address: {
      findUnique: jest.fn().mockImplementation((data: any) => {
        const { id } = data.where;

        if (id === 0) {
          return null;
        }

        return {
          id,
          userId: 1,
          firstName: 'John',
          lastName: 'Doe',
          phone: '+31624123123',
          country: 'Spain',
          countryCode: 'ES',
          city: 'Madrid',
          province: 'Madrid',
          postalCode: '03690',
          address: 'C/Calle nº1 4ºD',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    },
    user: {
      findUnique: jest.fn().mockImplementation((data: any) => {
        const { id } = data.where;

        return {
          id,
          email: mockAuthUser.email,
          firstName: mockAuthUser.firstName,
          lastName: mockAuthUser.lastName,
          password: 'password',
          oauthProvider: 'GOOGLE',
          role: 'USER',
          customerId: 'customerId',
          createdAt: new Date(),
          updatedAt: new Date(),
          wishlist: {
            id: 1
          },
          cart: {
            books: [
              {
                ...mockCartBook
              }
            ]
          }
        };
      })
    },
    order: {
      create: jest.fn().mockImplementation((data: any) => {
        const { addressId, userId, status, total, receiptUrl } = data.data;

        return {
          id: new Date().getTime(),
          userId,
          addressId,
          receiptUrl: receiptUrl || null,
          status,
          total,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }),
      findMany: jest.fn().mockImplementation((data: any) => {
        const { where } = data;

        if (where.userId === 0) {
          return [];
        }

        return [
          {
            id: new Date().getTime(),
            userId: where.userId,
            addressId: 1,
            receiptUrl: null,
            status: 'COMPLETED',
            total: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            books: [
              {
                ...mockCartBook
              }
            ]
          }
        ];
      }),
      findUnique: jest.fn().mockImplementation((data: any) => {
        const { id } = data.where;

        if (id === 0) {
          return null;
        }

        return {
          id,
          userId: 1,
          addressId: 1,
          receiptUrl: null,
          status: 'COMPLETED',
          total: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [
            {
              ...mockCartBook
            }
          ]
        };
      }),
      update: jest.fn().mockImplementation((data: any) => {
        const { where, data: updateOrderDto } = data;

        if (where.id === 0) {
          return null;
        }

        return {
          id: where.id,
          userId: 1,
          addressId: 1,
          receiptUrl: updateOrderDto.receiptUrl,
          status: 'COMPLETED',
          total: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [
            {
              ...mockCartBook
            }
          ]
        };
      })
    },
    cartBook: {
      deleteMany: jest.fn().mockImplementation((data: any) => {})
    },
    wishlistBook: {
      deleteMany: jest.fn().mockImplementation((data: any) => {})
    },
    $transaction: jest.fn().mockImplementation((args) => {
      if (Array.isArray(args)) {
        return args;
      }

      return args();
      // return args(mockPrismaService);
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: StripeService,
          useValue: mockStripeService
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createStripeCheckoutSession', () => {
    it('should create a stripe checkout session', async () => {
      const userId = 1;
      const checkoutDto = {
        cartItems: [
          {
            ...mockCartBook
          }
        ],
        addressId: 1
      };

      expect(await service.createStripeCheckoutSession(userId, checkoutDto, mockAuthUser)).toEqual({
        url: 'https://stripe.com/checkout',
        success_url: 'https://stripe.com/success',
        cancel_url: 'https://stripe.com/cancel'
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.address.findUnique).toHaveBeenCalledWith({
        where: {
          id: checkoutDto.addressId
        }
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: userId
        },
        include: {
          wishlist: {
            select: {
              id: true
            }
          }
        }
      });
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          addressId: 1,
          userId,
          status: 'PENDING',
          total: 0
        }
      });
    });

    it('should throw an error if the billing address is not found', async () => {
      const userId = 1;
      const checkoutDto = {
        cartItems: [
          {
            ...mockCartBook
          }
        ],
        addressId: 0
      };

      await expect(
        service.createStripeCheckoutSession(userId, checkoutDto, mockAuthUser)
      ).rejects.toThrowError('The billing address provided was not found');
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.address.findUnique).toHaveBeenCalledWith({
        where: {
          id: checkoutDto.addressId
        }
      });
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const userId = 2;
      const checkoutDto = {
        cartItems: [
          {
            ...mockCartBook
          }
        ],
        addressId: 1
      };

      await expect(
        service.createStripeCheckoutSession(userId, checkoutDto, mockAuthUser)
      ).rejects.toThrowError('You can only checkout your own cart');
    });
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto = {
        addressId: 1,
        userId: 1,
        receiptUrl: 'https://stripe.com/receipt'
      };

      expect(await service.create(createOrderDto)).toEqual({
        id: expect.any(Number),
        userId: createOrderDto.userId,
        addressId: createOrderDto.addressId,
        receiptUrl: createOrderDto.receiptUrl,
        status: 'COMPLETED',
        total: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(mockPrismaService.order.create).toHaveBeenCalled();
    });
  });

  describe('findAllByUserId', () => {
    it('should find all user orders by month and year', async () => {
      const findOrdersDto = {
        month: 11,
        year: 2023
      };

      expect(await service.findAllByUserId(1, findOrdersDto, mockAuthUser)).toEqual([
        {
          id: expect.any(Number),
          userId: 1,
          addressId: expect.any(Number),
          receiptUrl: null,
          status: expect.any(String),
          total: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          books: expect.any(Array)
        }
      ]);
      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    });

    it('should return an empty array if the user has no orders', async () => {
      const findOrdersDto = {
        month: 11,
        year: 2023
      };

      expect(await service.findAllByUserId(0, findOrdersDto, { ...mockAuthUser, id: 0 })).toEqual(
        []
      );
      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      const findOrdersDto = {
        month: 11,
        year: 2023
      };

      await expect(service.findAllByUserId(2, findOrdersDto, mockAuthUser)).rejects.toThrowError(
        'You can only see your own orders'
      );
    });
  });

  describe('findLastOrdersByUserId', () => {
    it('should find the last orders of the user', async () => {
      expect(await service.findLastOrdersByUserId(1, mockAuthUser)).toEqual({
        ordersByDate: {
          2023: [12]
        },
        orders: [
          {
            id: expect.any(Number),
            userId: 1,
            addressId: expect.any(Number),
            receiptUrl: null,
            status: expect.any(String),
            total: expect.any(Number),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            books: expect.any(Array)
          }
        ]
      });
      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    });

    it('should return an empty object if the user has no orders', async () => {
      expect(await service.findLastOrdersByUserId(0, { ...mockAuthUser, id: 0 })).toEqual({
        ordersByDate: {},
        orders: []
      });
      expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      await expect(service.findLastOrdersByUserId(2, mockAuthUser)).rejects.toThrowError(
        'You can only see your own orders'
      );
    });
  });

  describe('findOne', () => {
    it('should find an order by id', async () => {
      expect(await service.findOne(1, mockAuthUser)).toEqual({
        id: expect.any(Number),
        userId: 1,
        addressId: expect.any(Number),
        receiptUrl: null,
        status: expect.any(String),
        total: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        books: expect.any(Array)
      });
      expect(mockPrismaService.order.findUnique).toHaveBeenCalled();
    });

    it('should throw an error if the order is not found', async () => {
      await expect(service.findOne(0, mockAuthUser)).rejects.toThrowError(
        'The order provided was not found'
      );
      expect(mockPrismaService.order.findUnique).toHaveBeenCalled();
    });

    it('should throw an error if the user is not the same as the authenticated user', async () => {
      await expect(service.findOne(1, { ...mockAuthUser, id: 2 })).rejects.toThrowError(
        'You can only see your own orders'
      );
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto = {
        receiptUrl: 'https://stripe.com/receipt'
      };

      expect(await service.update(1, updateOrderDto)).toEqual({
        id: expect.any(Number),
        userId: 1,
        addressId: expect.any(Number),
        receiptUrl: updateOrderDto.receiptUrl,
        status: expect.any(String),
        total: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        books: expect.any(Array)
      });
      expect(mockPrismaService.order.update).toHaveBeenCalled();
    });

    it('should return null if the order is not found', async () => {
      const updateOrderDto = {
        receiptUrl: 'https://stripe.com/receipt'
      };

      expect(await service.update(0, updateOrderDto)).toBeNull();
      expect(mockPrismaService.order.update).toHaveBeenCalled();
    });
  });
});
