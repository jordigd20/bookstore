import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    description: 'The quantity of the book to add to the cart',
    example: 1
  })
  @IsNumber()
  quantity: number;
}
