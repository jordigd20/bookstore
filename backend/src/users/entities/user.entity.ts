import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

type Role = 'USER' | 'ADMIN';

export class UserEntity implements User {
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
    description: 'The password of the user',
    example: 'Test1234',
    writeOnly: true
  })
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'USER'
  })
  role: Role;

  @ApiProperty({
    writeOnly: true
  })
  createdAt: Date;

  @ApiProperty({
    writeOnly: true
  })
  updatedAt: Date;
}
