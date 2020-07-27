import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PhoneNumberValidators {
    static cannotContainDot(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).indexOf(' ') >= 0) {
            return { cannotContainDot: true };
        }
        return null;
    }
}
