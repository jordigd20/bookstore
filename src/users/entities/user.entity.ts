import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

type Role = 'USER' | 'ADMIN';
type OauthProvider = 'LOCAL' | 'GOOGLE';
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
    description: 'The oauth provider of the user',
    enum: ['LOCAL', 'GOOGLE'],
    example: 'LOCAL'
  })
  oauthProvider: OauthProvider;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Test1234',
    writeOnly: true
  })
  password: string;

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
    description: 'The wishlist id of the user',
    example: 1,
    required: false
  })
  wishlist?: number;

  @ApiProperty({
    description: 'The cart id of the user',
    example: 1,
    required: false
  })
  cart?: number;

  @ApiProperty({
    description: 'The updated date of the record',
    example: new Date(),
  })
  updatedAt: Date;
}
