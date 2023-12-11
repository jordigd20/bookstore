import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService
  ) {}

  async handleWebhooks(signature: string, rawBody: any) {
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event;

    try {
      event = await this.stripeService.stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        endpointSecret
      );
    } catch (error) {
      throw new BadRequestException(`Webhook error: ${error.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        this.paymentIntentSucceeded(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        throw new BadRequestException(`Unhandled event type ${event.type}`);
    }
  }

  async paymentIntentSucceeded(event: any) {
    const { receipt_url } = event.data.object.charges.data[0];
    const { wishlistId, cartId, orderId } = event.data.object.metadata;


    console.log(wishlistId, cartId, orderId);

    const cartItems = await this.prisma.cartBook.findMany({
      where: {
        cartId: Number(cartId)
      },
      include: {
        book: true
      }
    });
    
    console.log(cartItems);

    if (cartItems.length === 0) {
      throw new BadRequestException('The cart provided was not found or is empty');
    }

    const total = cartItems.reduce((acc, curr) => {
      return acc + curr.quantity * Number(curr.book.currentPrice);
    }, 0);

    console.log(total);
    
    try {
      const updateOrder = this.prisma.order.update({
        where: {
          id: Number(orderId)
        },
        data: {
          status: 'COMPLETED',
          receiptUrl: receipt_url,
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
          wishlistId: Number(wishlistId),
          AND: {
            bookId: {
              in: cartItems.map((item) => item.bookId)
            }
          }
        }
      });

      const [order, removeCart, removeWishlist] = await this.prisma.$transaction([
        updateOrder,
        removeCartItems,
        removeWishlistedItems
      ]);

      console.log(order);

      return order;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  handleDBError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException('There is already an account with this email');
      }
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
