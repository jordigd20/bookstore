import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService
  ) {}

  async handleWebhooks(signature: string, rawBody: any) {
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    console.log({ signature });
    console.log({ rawBody });
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

    console.log({ event });

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('payment_intent.succeeded');
        this.paymentIntentSucceeded(event);
        break;
      case 'payment_intent.payment_failed':
        console.log('payment_intent.payment_failed');
        break;
      case 'payment_intent.canceled':
        console.log('payment_intent.canceled');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        throw new BadRequestException(`Unhandled event type ${event.type}`);
    }
  }

  paymentIntentSucceeded(event: any) {
    console.log({
      amount: event.data.object.amount,
      metadata: event.data.object.metadata
    });
  }

  paymentIntentFailed(event: any) {}
}
