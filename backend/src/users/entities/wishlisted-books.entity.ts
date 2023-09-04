import { ApiProperty } from '@nestjs/swagger';

export class WishlistedBooksEntity {
  @ApiProperty({
    description: 'The id of the wishlisted book',
    type: Number
  })
  id: number;

  @ApiProperty({
    description: 'The date when the book was added to the wishlist',
    type: Date
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the book was last updated in the wishlist',
    type: Date
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The id of the wishlist',
    type: Number
  })
  wishlistId: number;

  @ApiProperty({
    description: 'The id of the book',
    type: Number
  })
  bookId: number;
}
