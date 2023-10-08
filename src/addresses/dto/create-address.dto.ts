import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO31661Alpha2,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  Validate
} from 'class-validator';
import { IsPostalCodeByCountryCode } from '../decorators/is-postal-code.decorator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  country: string;

  @ApiProperty()
  @IsISO31661Alpha2()
  @MinLength(2)
  countryCode: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  city: string;

  @ApiProperty()
  @IsString()
  @Validate(IsPostalCodeByCountryCode)
  postalCode: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  address: string;
}
