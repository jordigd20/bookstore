import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsISO31661Alpha2,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  MinLength
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @Length(13, 13)
  @IsString()
  ISBN: string;

  @ApiProperty()
  @MinLength(1)
  @IsString()
  title: string;

  @ApiProperty()
  @MinLength(1)
  @IsString()
  author: string;

  @ApiProperty()
  @MinLength(1)
  @IsString()
  publisher: string;

  @ApiProperty()
  @MinLength(1)
  @IsDateString()
  publishedDate: Date;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  pageCount: number;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  imageLink: string;

  @ApiProperty()
  @IsISO31661Alpha2()
  @MinLength(2)
  language: string;

  @ApiProperty()
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 2
  })
  currentPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBestseller?: boolean;

  @ApiProperty()
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 2
  })
  originalPrice: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  discount: number;

  @ApiProperty()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  categories: string[];
}
