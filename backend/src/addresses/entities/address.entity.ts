import { ApiProperty } from '@nestjs/swagger';
import { Address } from '@prisma/client';

export class AddressEntity implements Address {
  @ApiProperty({
    description: 'The id of the address',
    example: 154
  })
  id: number;

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
    description: 'The phone number with the intl. calling code',
    example: '+31123456789'
  })
  phone: string;

  @ApiProperty({
    description: 'The country of the user',
    example: 'Spain'
  })
  country: string;

  @ApiProperty({
    description: 'The name of the province or state',
    example: 'Barcelona',
    required: false
  })
  province: string;

  @ApiProperty({
    description: 'The city of residence',
    example: 'Barcelona'
  })
  city: string;

  @ApiProperty({
    description: 'The postal code of residence',
    example: '08001'
  })
  postalCode: string;

  @ApiProperty({
    description: 'The address of residence',
    example: 'Carrer de Sant Pau, 58'
  })
  address: string;

  @ApiProperty({
    description: 'The created date of the record',
    example: new Date()
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated date of the record',
    example: new Date()
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The id of the user who owns the address',
    example: 154
  })
  userId: number;
}
