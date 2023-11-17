import { ApiProperty } from '@nestjs/swagger';
import { CartBookEntity } from '../../carts/entities/cart-book.entity';
import { IsNumber, Validate } from 'class-validator';
import { IsValidCart } from '../decorators/is-valid-cart.decorator';

export class CheckoutDto {
  @ApiProperty({
    description: 'The cart items to checkout',
    type: CartBookEntity,
    isArray: true
  })
  @Validate(IsValidCart)
  cartItems: CartBookEntity[];

  @ApiProperty({
    description: 'The billing address',
    type: Number
  })
  @IsNumber()
  addressId: number;
}
