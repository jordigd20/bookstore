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
    private readonly prismaService: PrismaService
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
    const { addressId, userId } = event.data.object.metadata;

    try {
      const order = await this.prismaService.order.create({
        data: {
          addressId,
          userId,
          status: 'COMPLETED',
          receiptUrl: receipt_url
        }
      });

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
