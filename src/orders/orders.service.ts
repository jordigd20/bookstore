import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StripeService } from '../stripe/stripe.service';
import { CheckoutDto } from './dto/checkout.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { PrismaService } from '../prisma/prisma.service';

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
      }
    });

    const [address, user] = await this.prisma.$transaction([findAddress, findUser]);

    if (!address) {
      throw new BadRequestException('The billing address provided was not found');
    }

    if (!user) {
      throw new BadRequestException('The user provided was not found');
    }

    const response = await this.stripeService.stripe.checkout.sessions.create({
      currency: 'EUR',
      mode: 'payment',
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      success_url: `${process.env.CLIENT_URL}/success-checkout`,
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
          addressId: addressId
        }
      }
    });

    return {
      url: response.url,
      success_url: response.success_url,
      cancel_url: response.cancel_url
    };
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
