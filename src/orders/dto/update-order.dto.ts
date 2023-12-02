import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator';

class OrderBook {
  @ApiProperty({
    description: 'The id of the book to add to the order',
    example: 123
  })
  @IsNumber()
  bookId: number;

  @ApiProperty({
    description: 'The quantity of the book to add to the order',
    example: 1
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The price of the book',
    example: 9.99
  })
  @IsNumber()
  @IsPositive()
  price: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiProperty({
    description: 'The book details to add to the order',
    type: Object,
    isArray: true,
    example: [
      {
        bookId: 123,
        quantity: 1,
        price: 9.99
      }
    ]
  })
  @IsOptional()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => OrderBook)
  books?: OrderBook[];
}
