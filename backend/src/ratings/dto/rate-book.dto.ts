import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max } from 'class-validator';

export class RateBookDto {
  @ApiProperty({
    description: 'The id of the book to rate'
  })
  @IsNumber()
  bookId: number;

  @ApiProperty({
    description: 'The rating to give to the book',
    example: 4.5
  })
  @IsNumber({
    maxDecimalPlaces: 2
  })
  @IsPositive()
  @Max(5)
  rating: number;
}
