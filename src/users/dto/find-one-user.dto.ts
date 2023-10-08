import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindOneUserDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  includeAddress?: boolean;
}
