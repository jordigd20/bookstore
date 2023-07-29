import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
