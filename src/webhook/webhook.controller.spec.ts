import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import Stripe from 'stripe';
import { BadRequestException } from '@nestjs/common';

describe('WebhookController', () => {
  let controller: WebhookController;

  const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: '2023-08-16'
  });

  const webhookServiceMock = {
    handleWebhooks: jest.fn().mockImplementation((signature: string, rawBody: any) => {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event;

      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
      } catch (error) {
        throw new BadRequestException(`Webhook error: ${error.message}`);
      }

      switch (event.type) {
        case 'payment_intent.succeeded':
          return {
            id: new Date().getTime(),
            status: 'COMPLETED',
            createdAt: new Date(),
            updatedAt: new Date(),
            receiptUrl: event.data.object.charges.data[0].receipt_url,
            userId: event.data.object.metadata.userId,
            addressId: event.data.object.metadata.addressId
          };
        default:
          console.log(`Unhandled event type ${event.type}`);
          throw new BadRequestException(`Unhandled event type ${event.type}`);
      }
    })
  };

  const paymentIntentSucceededEvent = {
    id: 'evt_3ODQyrIs1Vk34TSF07xZLune',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        charges: {
          object: 'list',
          data: [
            {
              id: 'ch_3OEAHsIs1Vk34TSF11JpLPSR',
              object: 'charge',
              receipt_url: 'https://pay.stripe.com/receipts/...'
            }
          ]
        },
        metadata: {
          userId: 1,
          addressId: 2
        }
      }
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: webhookServiceMock
        }
      ]
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle a stripe webhook', () => {
    const rawBody = JSON.stringify(paymentIntentSucceededEvent, null, 2);

    const header = stripe.webhooks.generateTestHeaderString({
      payload: rawBody,
      secret: process.env.STRIPE_WEBHOOK_SECRET
    });

    expect(controller.webhook(header, { rawBody } as any)).toEqual({
      id: expect.any(Number),
      status: 'COMPLETED',
      receiptUrl: 'https://pay.stripe.com/receipts/...',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      userId: 1,
      addressId: 2
    });
    expect(webhookServiceMock.handleWebhooks).toHaveBeenCalledWith(header, rawBody);
  });

  it('should throw an error if stripe-signature header is missing or is not valid', () => {
    const rawBody = JSON.stringify(paymentIntentSucceededEvent, null, 2);
    const header = undefined;

    expect(() => controller.webhook(header, { rawBody } as any)).toThrowError(BadRequestException);
    expect(webhookServiceMock.handleWebhooks).toHaveBeenCalledWith(header, rawBody);
  });

  it('should throw an error if the event is unhandled', () => {
    const body = {
      id: 'evt_3ODQyrIs1Vk34TSF07xZLune',
      type: 'checkout.session.completed'
    };

    const rawBody = JSON.stringify(body, null, 2);

    const header = stripe.webhooks.generateTestHeaderString({
      payload: rawBody,
      secret: process.env.STRIPE_WEBHOOK_SECRET
    });

    expect(() => controller.webhook(header, { rawBody } as any)).toThrowError(BadRequestException);
    expect(webhookServiceMock.handleWebhooks).toHaveBeenCalledWith(header, rawBody);
  });
});
