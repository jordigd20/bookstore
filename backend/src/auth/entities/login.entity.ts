import { ApiProperty } from "@nestjs/swagger";

export class LoginEntity {
  @ApiProperty({
    description: 'The id of the user',
    example: 154
  })
  id: number;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@email.com'
  })
  email: string;

  @ApiProperty({
    description: 'The access token of the session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  token: string;
}