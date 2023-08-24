import { ApiProperty } from '@nestjs/swagger';

export class CartBookEntity {
  @ApiProperty({
    description: 'The id of the cart'
  })
  cartId: number;

  @ApiProperty({
    description: 'The id of the book in the cart'
  })
  bookId: number;

  @ApiProperty({
    description: 'The quantity of the book in the cart'
  })
  quantity: number;

  @ApiProperty({
    description: 'The date the book was added to the cart'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the book was last updated in the cart'
  })
  updatedAt: Date;
}
