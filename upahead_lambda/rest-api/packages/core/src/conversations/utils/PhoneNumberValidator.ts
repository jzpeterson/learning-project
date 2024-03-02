export class PhoneNumberValidator {
    public static validatePhoneNumber(phoneNumber: string): string {
        console.log("PreValidation PhoneNumber: ", phoneNumber);
        let validatedPhoneNumber = phoneNumber.trim();
        if (!validatedPhoneNumber.startsWith("+")) {
            console.log("Adding + to phone number: ", validatedPhoneNumber);
            validatedPhoneNumber = "+" + validatedPhoneNumber;
        }
        console.log("PostValidation PhoneNumber: ", validatedPhoneNumber);
        return validatedPhoneNumber;
    }
}