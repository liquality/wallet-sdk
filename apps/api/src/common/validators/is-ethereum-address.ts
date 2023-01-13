import { registerDecorator, ValidationOptions } from 'class-validator';
import { utils } from 'ethers';

export function IsEthereumAddress(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: string) => utils.isAddress(value),
        defaultMessage() {
          return `Invalid ethereum address. Perhaps an issue with checksum ?`;
        },
      },
    });
  };
}
