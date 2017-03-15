import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LogProvider } from '../../providers/logProvider';
 
@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPassword {

    constructor(public navCtrl: NavController, public logProvid: LogProvider) {
    }

    ionViewDidLoad() {
        
    }

    resetPassword() {
        this.logProvid.log("resetPassword");
    }
}
