import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
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
