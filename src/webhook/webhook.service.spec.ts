import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BadRequestException } from '@nestjs/common';
import { CreateBookDto } from '../books/dto/create-book.dto';

describe('WebhookService', () => {
  let service: WebhookService;

  const mockBook: CreateBookDto = {
    ISBN: '1234567890123',
    title: 'title of the book',
    description: 'description',
    author: 'author',
    publisher: 'publisher',
    publishedDate: new Date(),
    pageCount: 1,
    imageLink: 'imageLink',
    language: 'ES',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    categories: ['fiction-literature']
  };

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
      update: jest.fn().mockImplementation((data: any) => {
        const { id } = data.where;
        const { status, receiptUrl, total } = data.data;

        return {
          id,
          status,
          receiptUrl,
          total,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: new Date().getTime(),
          addressId: new Date().getTime()
        };
      })
    },
    cartBook: {
      findMany: jest.fn().mockImplementation((data: any) => {
        return [
          {
            book: {
              ...mockBook,
              id: new Date().getTime()
            },
            quantity: 1,
            bookId: new Date().getTime(),
            cartId: data.where.cartId,
            updatedAt: new Date(),
            createdAt: new Date()
          }
        ];
      }),
      deleteMany: jest.fn().mockImplementation((data: any) => {
        return {
          count: 1
        };
      })
    },
    wishlistBook: {
      deleteMany: jest.fn().mockImplementation((data: any) => {
        return {
          count: 1
        };
      })
    },
    $transaction: jest.fn().mockImplementation((args) => args)
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
          orderId: 1,
          userId: 2,
          cartId: 3,
          wishlistId: 4,
          addressId: 5
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
        total: 9.99,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: expect.any(Number),
        addressId: expect.any(Number)
      });
      expect(mockPrismaService.cartBook.findMany).toHaveBeenCalled();
      expect(mockPrismaService.order.update).toHaveBeenCalled();
      expect(mockPrismaService.cartBook.deleteMany).toHaveBeenCalled();
    });

    it('should throw an error if the cart is empty', async () => {
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

      mockPrismaService.cartBook.findMany = jest.fn().mockImplementation((data: any) => {
        return [];
      });

      await expect(service.paymentIntentSucceeded(event)).rejects.toThrowError(BadRequestException);
      expect(mockPrismaService.cartBook.findMany).toHaveBeenCalled();
    });
  });
});
