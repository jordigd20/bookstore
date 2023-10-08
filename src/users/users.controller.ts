import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Delete
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { BookEntity } from '../books/entities/book.entity';
import { WishlistedBooksEntity } from './entities/wishlisted-books.entity';
import { WishlistBooksDto } from './dto/wishlist-books.dto';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@ApiTags('users')
@Auth()
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Auth(ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Get(':term')
  findOne(
    @Param('term') term: string,
    @Query() findOneDto: FindOneUserDto,
    @GetUser() user: AuthUser
  ) {
    return this.usersService.findOne(term, findOneDto, user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: AuthUser
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @ApiOkResponse({ type: BookEntity, isArray: true })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id/wishlist')
  getWishlist(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: AuthUser
  ) {
    return this.usersService.getWishlist(id, paginationDto, user);
  }

  @ApiCreatedResponse({ type: WishlistedBooksEntity, isArray: true })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post(':id/wishlist')
  addToWishlist(
    @Param('id', ParseIntPipe) id: number,
    @Body() wishlistBooksDto: WishlistBooksDto,
    @GetUser() user: AuthUser
  ) {
    return this.usersService.addToWishlist(id, wishlistBooksDto, user);
  }

  @ApiOkResponse({ type: WishlistedBooksEntity, isArray: true })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete(':id/wishlist')
  removeFromWishlist(
    @Param('id', ParseIntPipe) id: number,
    @Body() wishlistBooksDto: WishlistBooksDto,
    @GetUser() user: AuthUser
  ) {
    return this.usersService.removeFromWishlist(id, wishlistBooksDto, user);
  }
}
