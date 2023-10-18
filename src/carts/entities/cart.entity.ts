import { ApiProperty } from '@nestjs/swagger';
import { CartBookEntity } from './cart-book.entity';

export class CartEntity {
  @ApiProperty({
    description: 'The total price of the cart',
    example: '14.99'
  })
  total: string;

  @ApiProperty({
    description: 'The books in the cart',
    type: CartBookEntity,
    isArray: true
  })
  cart: CartBookEntity[];
}
