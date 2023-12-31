import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from './config/joi.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { RatingsModule } from './ratings/ratings.module';
import { MailModule } from './mail/mail.module';
import { OrdersModule } from './orders/orders.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema,
    }),
    UsersModule,
    AuthModule,
    AddressesModule,
    BooksModule,
    CartsModule,
    RatingsModule,
    MailModule,
    OrdersModule,
    WebhookModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
