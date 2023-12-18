import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StripeService } from '../stripe/stripe.service';
import { CheckoutDto } from './dto/checkout.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FindOrdersDto } from './dto/find-orders.dto';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@Injectable()
export class OrdersService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService
  ) {}

  async createStripeCheckoutSession(userId: number, checkoutDto: CheckoutDto, authUser: AuthUser) {
    const { cartItems, addressId } = checkoutDto;

    if (authUser.role !== ValidRoles.admin && authUser.id !== userId) {
      throw new ForbiddenException('You can only checkout your own cart');
    }

    const findAddress = this.prisma.address.findUnique({
      where: {
        id: addressId
      }
    });

    const findUser = this.prisma.user.findUnique({
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

    const [address, user] = await this.prisma.$transaction([findAddress, findUser]);

    if (!address) {
      throw new BadRequestException('The billing address provided was not found');
    }

    if (!user) {
      throw new BadRequestException('The user provided was not found');
    }

    const order = await this.prisma.order.create({
      data: {
        addressId,
        userId,
        status: 'PENDING',
        total: 0
      }
    });

    const response = await this.stripeService.stripe.checkout.sessions.create({
      currency: 'EUR',
      mode: 'payment',
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      success_url: `${process.env.CLIENT_URL}/success-checkout/${order.id}`,
      line_items: cartItems.map((item) => {
        return {
          price_data: {
            currency: 'EUR',
            product_data: {
              name: item.book.title,
              images: [item.book.imageLink]
            },
            unit_amount: Number(item.book.currentPrice) * 100
          },
          quantity: item.quantity
        };
      }),
      customer: user.customerId,
      payment_method_types: ['card'],
      payment_intent_data: {
        metadata: {
          userId: userId,
          addressId: addressId,
          cartId: authUser.cart.id,
          wishlistId: user.wishlist.id,
          orderId: order.id
        }
      }
    });

    return {
      url: response.url,
      success_url: response.success_url,
      cancel_url: response.cancel_url
    };
  }

  async create(createOrderDto: CreateOrderDto) {
    const { addressId, userId, receiptUrl } = createOrderDto;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        cart: {
          include: {
            books: {
              include: {
                book: true
              }
            }
          }
        },
        wishlist: {
          select: {
            id: true
          }
        }
      }
    });

    const cartId = user.cart.id;
    const wishlistId = user.wishlist.id;
    const cartItems = user.cart.books;

    if (cartItems.length === 0) {
      throw new BadRequestException('The cart provided was not found or is empty');
    }

    const total = cartItems.reduce((acc, curr) => {
      return acc + curr.quantity * Number(curr.book.currentPrice);
    }, 0);

    try {
      const createOrder = this.prisma.order.create({
        data: {
          addressId,
          userId,
          status: 'COMPLETED',
          receiptUrl: receiptUrl,
          total,
          books: {
            create: cartItems.map((item) => {
              return {
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.book.currentPrice
              };
            })
          }
        }
      });

      const removeCartItems = this.prisma.cartBook.deleteMany({
        where: {
          cartId
        }
      });

      const removeWishlistedItems = this.prisma.wishlistBook.deleteMany({
        where: {
          wishlistId,
          AND: {
            bookId: {
              in: cartItems.map((item) => item.bookId)
            }
          }
        }
      });

      const [order, removeCart, removeWishlist] = await this.prisma.$transaction([
        createOrder,
        removeCartItems,
        removeWishlistedItems
      ]);

      return order;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAllByUserId(userId: number, findOrdersDto: FindOrdersDto, authUser: AuthUser) {
    const { month, year } = findOrdersDto;

    if (authUser.role !== ValidRoles.admin && authUser.id !== userId) {
      throw new ForbiddenException('You can only see your own orders');
    }

    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1)
          }
        },
        include: {
          books: {
            include: {
              book: true
            }
          }
        }
      });

      return orders;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findLastOrdersByUserId(userId: number, authUser: AuthUser) {
    if (authUser.role !== ValidRoles.admin && authUser.id !== userId) {
      throw new ForbiddenException('You can only see your own orders');
    }

    try {
      // Get the years and months the user has orders
      const orders = await this.prisma.order.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          createdAt: true
        }
      });

      if (orders.length === 0) {
        return {
          ordersByDate: {},
          orders: []
        };
      }

      const ordersByDate = {};

      for (const order of orders) {
        const year = order.createdAt.getFullYear();
        const month = order.createdAt.getMonth() + 1;

        if (ordersByDate[year]) {
          ordersByDate[year].add(month);
        } else {
          ordersByDate[year] = new Set<number>([month]);
        }
      }

      // Replace the sets with arrays
      for (const year in ordersByDate) {
        ordersByDate[year] = [...ordersByDate[year]];
      }

      const lastYear = Math.max(...Object.keys(ordersByDate).map((year) => Number(year)));
      const lastMonth = Math.max(...ordersByDate[lastYear]);

      const lastOrders = await this.findAllByUserId(
        userId,
        {
          month: lastMonth,
          year: lastYear
        },
        authUser
      );

      return {
        ordersByDate,
        orders: lastOrders
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOne(id: number, authUser: AuthUser) {
    const order = await this.prisma.order.findUnique({
      where: {
        id
      },
      include: {
        books: {
          include: {
            book: true
          }
        }
      }
    });

    if (!order) {
      throw new BadRequestException('The order provided was not found');
    }

    if (authUser.role !== ValidRoles.admin && order.userId !== authUser.id) {
      throw new ForbiddenException('You can only see your own orders');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const { receiptUrl, books } = updateOrderDto;
    const data = {};

    try {
      if (receiptUrl) {
        data['receiptUrl'] = receiptUrl;
      }

      if (books) {
        data['books'] = {
          deleteMany: {
            orderId: id
          },
          createMany: {
            data: books.map((item) => {
              return {
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.price
              };
            })
          }
        };
      }

      const order = await this.prisma.order.update({
        where: {
          id
        },
        data,
        include: {
          books: {
            include: {
              book: true
            }
          }
        }
      });

      return order;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.orderBook.deleteMany({
          where: {
            orderId: id
          }
        });

        await tx.order.delete({
          where: {
            id
          }
        });
      });

      return {
        message: 'Order deleted successfully',
        statusCode: 200
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  handleDBError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException('There is already an account with this email');
      }

      if (error.code === 'P2025') {
        throw new BadRequestException('Invalid data provided');
      }
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
