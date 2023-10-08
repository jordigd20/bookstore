import { ApiProperty } from '@nestjs/swagger';
import { CartBookEntity } from './cart-book.entity';

export class CartEntity {
  @ApiProperty({
    description: 'The id of the cart'
  })
  id: number;

  @ApiProperty({
    description: 'The date the cart was created'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the cart was last updated'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The id of the user that owns the cart'
  })
  userId: number;

  @ApiProperty({
    description: 'The books in the cart',
    type: CartBookEntity,
    isArray: true
  })
  books: CartBookEntity[];
}
