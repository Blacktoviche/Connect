import { FormControl } from '@angular/forms';
import { ValidationResult } from '../shared/interfaces';

export class ConfirmPasswordValidator {
    static checkConfirmPassword(control: FormControl): ValidationResult {

        //console.log('dd: '+control.parent.controls['password'])
        if (control.value == control.root.value['password']) {
            console.log('passwords  match');
            return null;
        } else {
            return { isValid: true };
        }
        /*
        
                let myObject = control.parent;
                //console.log(' vv : '+control.parent.value);
        
                for (var propertyName in myObject) {
                    if (typeof myObject[propertyName] !== "function") {
                        if (propertyName == 'value') {
                            //console.log(' vv : ' + myObject["value"]);
                            let newObj = myObject[propertyName];
                            //console.log('prop  : ' + newObj);
                            for (var pro in newObj) {
                                if (typeof newObj[pro] !== "function") {
                                    console.log(pro + ' : ' + newObj[pro]);
                                    if (pro == 'password') {
                                        if (control.value == newObj[pro]) {
                                            console.log('passwords  match');
                                            return null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        
                return { isValid: true };
            }*/
    }
}
 /*
            let myObject = control.parent;
            for (var propertyName in myObject) {
                // propertyName is what you want
                // you can get the value like this: myObject[propertyName]
                if (typeof myObject[propertyName] !== "function") {
                    if (propertyName == 'value') {
                        let newObj = myObject[propertyName];
                        console.log(' : '+newObj);
                        for (var pro in newObj) {
                            // propertyName is what you want
                            // you can get the value like this: myObject[propertyName]
                            if (typeof newObj[pro] !== "function") {
                                 
                                //console.log(pro+' : '+newObj[pro]);
                            }
                        }

                    }
                    //console.log(propertyName+' : '+myObject[propertyName]);
                }
            }
     
            console.log('vale:1 ' + control.parent.value['password']);
            console.log('vale:2 ' + control.parent.value['confirmPassword']);
            console.log('vale:3 ' + control.value);

            //let grp = control.parent;
            //let password = grp.get('password').value;
            //console.log('password: '+grp.get('password').value);
*/