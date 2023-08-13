import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetCategoriesDto {
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  categories?: string;
}