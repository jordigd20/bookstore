import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsString } from "class-validator";

export class GoogleSigninDto {
  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsString()
  client_id: string;

  @ApiProperty()
  @IsString()
  @IsJWT()
  credential: string;

  @ApiProperty()
  @IsString()
  select_by: string;
}