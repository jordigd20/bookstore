import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthEntity {
  @ApiProperty({
    description: 'The user of the session',
    type: UserEntity
  })
  user: UserEntity;

  @ApiProperty({
    description: 'The access token of the session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  })
  token: string;
}
