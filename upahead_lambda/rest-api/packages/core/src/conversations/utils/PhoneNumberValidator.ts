export class PhoneNumberValidator {
    private static readonly DEFAULT_COUNTRY_CODE = "1";
    private static readonly COUNTRY_CODE_PREFIX = "+";
// TODO we need to test for lots of use cases here or our data will be messed up.
    // TODO write a way to handle international text messages that don't start with a +1
    public static validatePhoneNumber(phoneNumber: string): string {
        console.log("PreValidation PhoneNumber: ", phoneNumber);
        let validatedPhoneNumber = phoneNumber.toString();
        validatedPhoneNumber = validatedPhoneNumber.trim();

        validatedPhoneNumber = validatedPhoneNumber.replace(/\D/g, '');

        if (!validatedPhoneNumber.startsWith(PhoneNumberValidator.DEFAULT_COUNTRY_CODE)) {
            console.log("Adding default country code to phone number: ", validatedPhoneNumber);
            validatedPhoneNumber = PhoneNumberValidator.DEFAULT_COUNTRY_CODE + validatedPhoneNumber;
        }

        if (!validatedPhoneNumber.startsWith(PhoneNumberValidator.COUNTRY_CODE_PREFIX)) {
            console.log("Adding + to phone number: ", validatedPhoneNumber);
            validatedPhoneNumber = PhoneNumberValidator.COUNTRY_CODE_PREFIX + validatedPhoneNumber;
        }

        console.log("PostValidation PhoneNumber: ", validatedPhoneNumber);
        return validatedPhoneNumber;
    }
}