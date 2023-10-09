import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { AuthGuard } from '@nestjs/passport';

export function Auth(jwtStrategy: string = 'jwt', ...roles: ValidRoles[]) {
  return applyDecorators(RoleProtected(...roles), UseGuards(AuthGuard(jwtStrategy), UserRoleGuard));
}
