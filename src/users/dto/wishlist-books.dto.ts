import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class WishlistBooksDto {
  @ApiProperty({
    description: 'The ids of the books to add or remove from the wishlist'
  })
  @IsNumber({}, { each: true })
  bookIds: number[];

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  take?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  skip?: number;
}
