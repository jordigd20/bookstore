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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { BookEntity } from '../books/entities/book.entity';
import { WishlistedBooksEntity } from './entities/wishlisted-books.entity';
import { WishlistBooksDto } from './dto/wishlist-books.dto';

@ApiTags('users')
@Auth()
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':term')
  findOne(
    @Param('term') term: string,
    @Query()
    findOneDto: FindOneUserDto
  ) {
    return this.usersService.findOne(term, findOneDto);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOkResponse({ type: BookEntity, isArray: true })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id/wishlist')
  getWishlist(@Param('id', ParseIntPipe) id: number, @Query() paginationDto: PaginationDto) {
    return this.usersService.getWishlist(id, paginationDto);
  }

  @ApiCreatedResponse({ type: WishlistedBooksEntity, isArray: true })
  @Post(':id/wishlist')
  addToWishlist(@Param('id', ParseIntPipe) id: number, @Body() wishlistBooksDto: WishlistBooksDto) {
    return this.usersService.addToWishlist(id, wishlistBooksDto);
  }

  @ApiOkResponse({ type: WishlistedBooksEntity, isArray: true })
  @Delete(':id/wishlist')
  removeFromWishlist(
    @Param('id', ParseIntPipe) id: number,
    @Body() wishlistBooksDto: WishlistBooksDto
  ) {
    return this.usersService.removeFromWishlist(id, wishlistBooksDto);
  }
}
