import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddBookToCartDto } from './dto/add-book-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { CartEntity } from './entities/cart.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@ApiTags('carts')
@Auth()
@ApiBearerAuth()
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiCreatedResponse({ type: CartEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post(':id')
  addBookToCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() addBookToCartDto: AddBookToCartDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.cartsService.addBookToCart(id, addBookToCartDto, authUser);
  }

  @ApiOkResponse({ type: CartEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() authUser: AuthUser) {
    return this.cartsService.findOne(id, authUser);
  }

  @ApiOkResponse({ type: CartEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Patch(':id/books/:bookId')
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() updateCartDto: UpdateCartDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.cartsService.updateBook(id, bookId, updateCartDto, authUser);
  }

  @ApiOkResponse({ type: CartEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Delete(':id/books/:bookId')
  removeBook(
    @Param('id', ParseIntPipe) id: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @GetUser() authUser: AuthUser
  ) {
    return this.cartsService.removeBook(id, bookId, authUser);
  }
}
