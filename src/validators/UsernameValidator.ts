import { FormControl , FormGroup} from '@angular/forms';

export class UsernameValidator {

    static checkUsername(control: FormGroup): any {

        return new Promise(resolve => {
             if (control.value.toLowerCase() === "greg") {
                    resolve({
                        "username taken": true
                    });

                } else {
                    resolve(null);
                }

        });
    }
}