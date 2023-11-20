import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  cartId: number;

  @IsNumber()
  addressId: number;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
