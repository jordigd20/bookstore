import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from './order.entity';

export class LastOrdersEntity {
  @ApiProperty({
    description: 'The dates in which the user has made orders, grouped by year and month',
    type: Object,
    example: {
      2022: [1, 6, 11],
      2023: [4, 5, 12]
    }
  })
  ordersByDate: {};

  @ApiProperty({
    description:
      'All orders placed by the user in the last month that the user purchased something',
    type: OrderEntity,
    isArray: true
  })
  orders: OrderEntity[];
}
