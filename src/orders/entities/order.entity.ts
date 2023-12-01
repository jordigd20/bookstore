import { Order, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { OrderBookEntity } from './order-book.entity';

export class OrderEntity implements Order {
  @ApiProperty({
    description: 'The id of the order',
    type: Number
  })
  id: number;

  @ApiProperty({
    description: 'The id of the address',
    type: Number
  })
  addressId: number;

  @ApiProperty({
    description: 'The id of the user',
    type: Number
  })
  userId: number;

  @ApiProperty({
    description: 'The status of the order',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']
  })
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

  @ApiProperty({
    description: 'The total amount of the order',
    type: String
  })
  total: Prisma.Decimal;

  @ApiProperty({
    description: 'The receipt url of the order',
    type: String
  })
  receiptUrl: string;

  @ApiProperty({
    description: 'The date the order was created',
    type: Date
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the order was updated',
    type: Date
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The books of the order',
    type: OrderBookEntity,
    isArray: true
  })
  books: OrderBookEntity[];
}
