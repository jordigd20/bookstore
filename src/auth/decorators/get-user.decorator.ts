import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator
} from '@nestjs/common';
import { AuthUser } from '../interfaces/auth-user.interface';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: AuthUser = request.user;

  if (!user) {
    throw new InternalServerErrorException('User not found in request');
  }

  return (!data) ? user : user[data];
});
