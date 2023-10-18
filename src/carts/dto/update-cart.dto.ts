import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    description: 'The quantity of the book to add to the cart',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
