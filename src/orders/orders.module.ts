import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { StripeModule } from 'src/stripe/stripe.module';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
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
export class OrdersModule {}
