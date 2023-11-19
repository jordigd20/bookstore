import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BadRequestException } from '@nestjs/common';

describe('WebhookService', () => {
  let service: WebhookService;

  const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: '2023-08-16'
  });

  const mockStripeService = {
    stripe: {
      webhooks: {
        constructEventAsync: jest
          .fn()
          .mockImplementation((rawBody: any, signature: string, endpointSecret: string) => {
            return stripe.webhooks.constructEventAsync(rawBody, signature, endpointSecret);
          })
      }
    }
  };

  const mockPrismaService = {
    order: {
      create: jest.fn().mockImplementation((data: any) => {
        return {
          id: new Date().getTime(),
          status: 'COMPLETED',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: data.data.userId,
          addressId: data.data.addressId,
          receiptUrl: data.data.receiptUrl
        };
      })
    }
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
      providers: [
        WebhookService,
        ConfigService,
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

    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleWebhooks', () => {
    it('should handle a stripe webhook', () => {
      const rawBody = JSON.stringify(paymentIntentSucceededEvent, null, 2);

      const header = stripe.webhooks.generateTestHeaderString({
        payload: rawBody,
        secret: process.env.STRIPE_WEBHOOK_SECRET
      });

      expect(() => service.handleWebhooks(header, rawBody)).not.toThrowError(BadRequestException);
      expect(mockStripeService.stripe.webhooks.constructEventAsync).toHaveBeenCalledWith(
        rawBody,
        header,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    });

    it('should throw an error if stripe-signature header is missing or is not valid', async () => {
      const rawBody = JSON.stringify(paymentIntentSucceededEvent, null, 2);
      const header = undefined;

      await expect(service.handleWebhooks(header, rawBody)).rejects.toThrowError(
        BadRequestException
      );
      expect(mockStripeService.stripe.webhooks.constructEventAsync).toHaveBeenCalledWith(
        rawBody,
        header,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    });

    it('should throw an error if event type is not handled', async () => {
      const body = {
        id: 'evt_3ODQyrIs1Vk34TSF07xZLune',
        type: 'checkout.session.completed'
      };

      const rawBody = JSON.stringify(body, null, 2);

      const header = stripe.webhooks.generateTestHeaderString({
        payload: rawBody,
        secret: process.env.STRIPE_WEBHOOK_SECRET
      });

      await expect(service.handleWebhooks(header, rawBody)).rejects.toThrowError(
        BadRequestException
      );
      expect(mockStripeService.stripe.webhooks.constructEventAsync).toHaveBeenCalledWith(
        rawBody,
        header,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    });
  });

  describe('paymentIntentSucceeded', () => {
    it('should create an order', async () => {
      const rawBody = JSON.stringify(paymentIntentSucceededEvent, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: rawBody,
        secret: process.env.STRIPE_WEBHOOK_SECRET
      });

      const event = await stripe.webhooks.constructEventAsync(
        rawBody,
        header,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      expect(await service.paymentIntentSucceeded(event)).toEqual({
        id: expect.any(Number),
        status: 'COMPLETED',
        receiptUrl: 'https://pay.stripe.com/receipts/...',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: 1,
        addressId: 2
      });
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          addressId: 2,
          userId: 1,
          status: 'COMPLETED',
          receiptUrl: 'https://pay.stripe.com/receipts/...'
        }
      });
    });
  });
});
