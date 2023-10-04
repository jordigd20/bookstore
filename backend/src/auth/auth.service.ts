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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService
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
