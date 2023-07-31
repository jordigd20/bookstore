import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from './config/joi.validation';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema
    }),
    UsersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
