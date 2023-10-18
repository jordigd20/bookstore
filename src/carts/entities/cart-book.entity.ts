import { ApiProperty } from '@nestjs/swagger';
import { BookEntity } from '../../books/entities/book.entity';

export class CartBookEntity {
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

  @ApiProperty({
    description: 'The id of the book in the cart',
    type: BookEntity
  })
  book: BookEntity;
}
