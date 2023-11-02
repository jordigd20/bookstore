import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    type: String,
    example: 'John'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    type: String,
    example: 'Doe'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;
}
