import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { GoogleSigninDto } from './dto/google-signin.dto';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserEntity, description: 'User created' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity, description: 'User logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('token')
  @ApiOkResponse({ type: AuthEntity, description: 'Token refreshed' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  refreshToken(@Headers('authorization') bearerToken: string) {
    return this.authService.refreshToken(bearerToken);
  }

  @Post('google')
  @ApiOkResponse({ type: AuthEntity, description: 'User logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  googleSignin(@Body() googleDto: GoogleSigninDto) {
    return this.authService.googleSignin(googleDto);
  }
}
