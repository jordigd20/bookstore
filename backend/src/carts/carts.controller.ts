import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddBookToCartDto } from './dto/add-book-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { CartBookEntity } from './entities/cart-book.entity';
import { CartEntity } from './entities/cart.entity';

@ApiTags('carts')
@Auth()
@ApiBearerAuth()
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiCreatedResponse({ type: CartBookEntity, isArray: true })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Post(':id')
  addBookToCart(@Param('id', ParseIntPipe) id: number, @Body() addBookToCartDto: AddBookToCartDto) {
    return this.cartsService.addBookToCart(id, addBookToCartDto);
  }

  @ApiOkResponse({ type: CartEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartsService.findOne(id);
  }

  @ApiOkResponse({ type: CartBookEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Patch(':id/books/:bookId')
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() updateCartDto: UpdateCartDto
  ) {
    return this.cartsService.updateBook(id, bookId, updateCartDto);
  }

  @ApiOkResponse({ description: 'Book removed from the cart successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Delete(':id/books/:bookId')
  removeBook(@Param('id', ParseIntPipe) id: number, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.cartsService.removeBook(id, bookId);
  }
}
