import { ApiProperty } from "@nestjs/swagger";

type Role = 'USER' | 'ADMIN';
export class AuthEntity {
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
    description: 'The first name of the user',
    example: 'John'
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe'
  })
  lastName: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: ['USER', 'ADMIN'],
    example: 'USER'
  })
  role: Role;

  @ApiProperty({
    description: 'The created date of the record',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The access token of the session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  token: string;
}