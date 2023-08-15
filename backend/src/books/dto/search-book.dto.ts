import { IsEnum, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchBookDto {
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

  @ApiPropertyOptional({
    default: '',
    example: 'fiction-literature'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    default: '',
    enum: ['price.asc', 'price.desc', 'rating.asc', 'rating.desc', 'title.asc', 'title.desc', 'publishedDate.asc', 'publishedDate.desc']
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    default: '',
    example: '0-50'
  })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({ 
    default: '',
    enum: ['discounted', 'bestseller', 'discounted.bestseller', 'bestseller.discounted']
   })
  @IsOptional()
  @IsEnum(['discounted', 'bestseller', 'discounted.bestseller', 'bestseller.discounted', ''], {
    message:
      'Filter must be one of the following: discounted, bestseller, discounted.bestseller, bestseller.discounted'
  })
  filter?: string;

  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  search?: string;
}
