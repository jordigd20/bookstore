import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { StripeModule } from '../stripe/stripe.module';
import { MailModule } from '../mail/mail.module';
import { ResetPasswordStrategy } from './strategies/jwt-reset-password.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ResetPasswordStrategy],
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '2h' }
      })
    }),
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE_API_KEY'),
        options: {
          apiVersion: '2023-08-16'
        }
      })
    }),
    MailModule
  ],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
