import { CartBookEntity } from '../../carts/entities/cart-book.entity';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidCart', async: false })
export class IsValidCart implements ValidatorConstraintInterface {
  validate(cartItems: CartBookEntity[], args: ValidationArguments) {
    if (!args.object['cartItems']) return false;

    const requiredProperties = [
      'id',
      'ISBN',
      'description',
      'discount',
      'imageLink',
      'isBestseller',
      'originalPrice',
      'currentPrice',
      'pageCount',
      'publishedDate',
      'publisher',
      'slug',
      'title'
    ];

    for (let i = 0; i < cartItems.length; i++) {
      if (!cartItems[i].quantity) {
        return false;
      }

      if (!cartItems[i].book) {
        return false;
      }

      for (const prop of requiredProperties) {
        if (cartItems[i].book[prop] == null) {
          return false;
        }
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const cartItems = args.object['cartItems'];
    const requiredProperties = [
      'id',
      'ISBN',
      'description',
      'discount',
      'imageLink',
      'isBestseller',
      'originalPrice',
      'currentPrice',
      'pageCount',
      'publishedDate',
      'publisher',
      'slug',
      'title'
    ];

    for (let i = 0; i < cartItems.length; i++) {
      if (!cartItems[i].quantity) {
        return 'Missing property "quantity" in cart item';
      }

      if (!cartItems[i].book) {
        return 'Missing property "book" in cart item';
      }

      for (const prop of requiredProperties) {
        if (cartItems[i].book[prop] == null) {
          return `Missing property "${prop}" in book`;
        }
      }
    }

    return `Invalid cart provided`;
  }
}
