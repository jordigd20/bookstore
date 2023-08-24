import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddToCart {
  @ApiProperty({
    description: 'The id of the book to add to the cart',
    example: 123
  })
  @IsNumber()
  bookId: number;

  @ApiProperty({
    description: 'The quantity of the book to add to the cart',
    example: 1
  })
  @IsNumber()
  quantity: number;
}

export class AddBookToCartDto {
  @ApiProperty({
    description: 'The ids of the books to add to the cart',
    type: Object,
    isArray: true,
    example: [
      {
        bookId: 123,
        quantity: 1
      }
    ]
  })
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AddToCart)
  books: AddToCart[];
}
