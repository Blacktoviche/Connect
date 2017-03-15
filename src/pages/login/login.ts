import { ForgotPassword } from "../forgot-password/forgot-password";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Signup } from "../signup/signup";
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Home } from "../home/home";
import { MediatorProvider } from '../../providers/mediatorProvider';
import { UtilsProvider } from '../../providers/utilsProvider';
import { LogProvider } from '../../providers/logProvider';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class Login {

    loginForm: FormGroup;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public utils: UtilsProvider,
        public formBuilder: FormBuilder, public medProvid: MediatorProvider, public logProvid: LogProvider) {
        this.loginForm = formBuilder.group({
            email: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required]],
            password: ['', [Validators.minLength(8), Validators.required]],
        });

    }

    ionViewDidLoad() {

    }


    signup() {
        this.navCtrl.push(Signup);
    }

    login() {
        var self = this;
        let user = {
            uid: '',
            password: this.loginForm.value.password,
            email: this.loginForm.value.email
        };
        this.medProvid.login(user)
            .then((data) => {
                user.uid = data.uid;
                self.medProvid.saveLoggedinUser(user);
                this.navCtrl.push(Home);
            }, (error) => {
                let alert = this.utils.showMessage("Error", error.message, "Ok");
                alert.present();
            });
    }

    forgotPassword() {
        this.navCtrl.push(ForgotPassword);
    }
}
