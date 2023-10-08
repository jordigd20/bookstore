import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isPostalCode
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPostalCodeByCountryCode', async: false })
export class IsPostalCodeByCountryCode implements ValidatorConstraintInterface {
  validate(postalCode: string, args: ValidationArguments) {
    if (!args.object['countryCode']) return false;

    return isPostalCode(postalCode, args.object['countryCode']);
  }

  defaultMessage(args: ValidationArguments): string {
    return `Invalid postal code "${args.value}" for country "${args.object['countryCode']}"`;
  }
}
