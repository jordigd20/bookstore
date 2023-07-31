import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindOneUserDto {
  @IsOptional()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  includeAddress?: boolean;
}
