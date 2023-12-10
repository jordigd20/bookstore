import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  addressId: number;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
