import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService
  ) {}

  async handleWebhooks(signature: string, body: any) {
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    console.log(signature);
    console.log(body);

    let event;

    try {
      event = await this.stripeService.stripe.webhooks.constructEventAsync(
        body,
        signature,
        endpointSecret
      );
    } catch (error) {
      throw new BadRequestException(`Webhook error: ${error.message}`);
    }

    console.log(event);

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
    // const paymentIntent = event.data.object;
  }

  paymentIntentFailed(event: any) {}
}
