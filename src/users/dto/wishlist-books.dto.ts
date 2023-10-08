import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WishlistBooksDto {
  @ApiProperty({
    description: 'The ids of the books to add or remove from the wishlist'
  })
  @IsNumber({}, { each: true })
  bookIds: number[];
}
