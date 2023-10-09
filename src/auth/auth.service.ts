import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { StripeService } from '../stripe/stripe.service';
import { GoogleSigninDto } from './dto/google-signin.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, email, firstName, lastName } = createUserDto;

      const user = await this.prisma.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          password: bcrypt.hashSync(password, 10),
          cart: { create: {} },
          wishlist: { create: {} }
        },
        include: {
          cart: true,
          wishlist: true
        }
      });

      await this.stripeService.stripe.customers.create({
        email: email.toLowerCase().trim(),
        name: `${firstName.trim()} ${lastName.trim()}`
      });

      delete user.password;
      return {
        ...user,
        wishlist: user.wishlist.id,
        cart: user.cart.id
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        cart: true,
        wishlist: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Could not find your account');
    }

    if (user.oauthProvider !== 'LOCAL') {
      throw new BadRequestException('This verification strategy is not valid for this account');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
    return {
      user: {
        ...user,
        wishlist: user.wishlist.id,
        cart: user.cart.id
      },
      token: this.getJwtToken({ id: user.id })
    };
  }

  async refreshToken(bearerToken: string) {
    try {
      const token = bearerToken.replace('Bearer ', '');
      const payload = this.jwtService.verify(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        include: {
          cart: true,
          wishlist: true
        }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      delete user.password;
      return {
        user: {
          ...user,
          wishlist: user.wishlist.id,
          cart: user.cart.id
        },
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async googleSignin(googleDto: GoogleSigninDto) {
    const client = new OAuth2Client({
      clientId: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET')
    });

    const ticket = await client.verifyIdToken({
      idToken: googleDto.credential,
      audience: this.configService.get('GOOGLE_CLIENT_ID')
    });

    const { email, given_name, family_name } = ticket.getPayload();

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        cart: true,
        wishlist: true
      }
    });

    if (!user) {
      const createStripeCustomer = this.stripeService.stripe.customers.create({
        email: email.toLowerCase().trim(),
        name: `${given_name} ${family_name}`
      });

      const createUser = this.prisma.user.create({
        data: {
          firstName: given_name,
          lastName: family_name,
          email: email,
          oauthProvider: 'GOOGLE',
          cart: { create: {} },
          wishlist: { create: {} }
        },
        include: {
          cart: true,
          wishlist: true
        }
      });

      const [stripeCustomer, createdUser] = await Promise.all([createStripeCustomer, createUser]);

      delete createdUser.password;
      return {
        user: {
          ...createdUser,
          wishlist: createdUser.wishlist.id,
          cart: createdUser.cart.id
        },
        token: this.getJwtToken({ id: createdUser.id })
      };
    }

    delete user.password;
    return {
      user: {
        ...user,
        wishlist: user.wishlist.id,
        cart: user.cart.id
      },
      token: this.getJwtToken({ id: user.id })
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        oauthProvider: true,
        firstName: true
      }
    });

    if (!user) {
      throw new BadRequestException('Could not find your account');
    }

    if (user.oauthProvider !== 'LOCAL') {
      throw new BadRequestException('This method is not valid for this account');
    }

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_PASSWORD_SECRET'),
        expiresIn: '10m'
      }
    );
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const url = `${frontendUrl}/reset-password?token=${token}`;

    const mail = await this.mailService.sendForgotPassword({
      email,
      name: user.firstName,
      url,
      frontendUrl
    });

    if (mail.rejected.length > 0) {
      throw new InternalServerErrorException('Could not send email');
    }

    return {
      message: 'Email sent successfully',
      ok: true
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, authUser: AuthUser) {
    try {
      await this.prisma.user.update({
        where: { id: authUser.id },
        data: {
          password: bcrypt.hashSync(resetPasswordDto.password, 10)
        }
      });

      return {
        message: 'Your password has been updated successfully',
        ok: true
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  handleDBError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException('There is already an account with this email');
      }
    }

    console.log(error);
    throw new InternalServerErrorException('Check server logs for more info');
  }
}
