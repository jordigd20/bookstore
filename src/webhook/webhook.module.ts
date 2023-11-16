import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { StripeModule } from '../stripe/stripe.module';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, ConfigService],
  imports: [
    PrismaModule,
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE_API_KEY'),
        options: {
          apiVersion: '2023-08-16'
        }
      })
    })
  ]
})
export class WebhookModule {}
