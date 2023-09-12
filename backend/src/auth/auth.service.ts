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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly stripeService: StripeService
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, email, firstName, lastName } = createUserDto;

      const createStripeCustomer = this.stripeService.stripe.customers.create({
        email: email.toLowerCase().trim(),
        name: `${firstName.trim()} ${lastName.trim()}`
      });

      const createUser = this.prisma.user.create({
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

      const [stripeCustomer, user] = await Promise.all([createStripeCustomer, createUser]);
      const { password: _, cart, wishlist, ...userData } = user;

      return {
        ...userData,
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        wishlist: true,
        cart: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
    return {
      ...user,
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
