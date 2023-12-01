import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class FindOrdersDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;
  
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  year: number;
}
