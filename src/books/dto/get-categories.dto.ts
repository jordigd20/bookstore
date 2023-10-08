import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetCategoriesDto {
  // Example: fiction-literature.romance
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  categories?: string;
}