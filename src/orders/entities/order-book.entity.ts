import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { BookEntity } from '../../books/entities/book.entity';

export class OrderBookEntity {
  @ApiProperty({
    description: 'The id of the order-book',
    type: Number
  })
  id: number;

  @ApiProperty({
    description: 'The id of the order',
    type: Number
  })
  orderId: number;

  @ApiProperty({
    description: 'The quantity purchased',
    type: Number
  })
  quantity: number;

  @ApiProperty({
    description: 'The price of the book',
    type: String
  })
  price: Prisma.Decimal;

  @ApiProperty({
    description: 'The date the order-book was created',
    type: Date
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the order-book was updated',
    type: Date
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The book of the order-book',
    type: BookEntity
  })
  book: BookEntity;
}