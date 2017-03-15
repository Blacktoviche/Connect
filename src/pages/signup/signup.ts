import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsernameValidator } from '../../validators/UsernameValidator';
import { ConfirmPasswordValidator } from '../../validators/ConfirmPasswordValidator';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { Home } from '../home/home';
import { User } from '../../shared/interfaces';
import { UtilsProvider } from '../../providers/utilsProvider';
import { LogProvider } from '../../providers/logProvider';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class Signup {

  signupForm: FormGroup;
  submitAttempt: boolean = false;
  userAlreadyExist: boolean = false;


  constructor(public navCtrl: NavController, public utils: UtilsProvider,
    public formBuilder: FormBuilder, public medProvid: MediatorProvider, public logProvid: LogProvider) {

    this.signupForm = formBuilder.group({
      username: ['', [Validators.minLength(4), Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required]],
      email: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required, ConfirmPasswordValidator.checkConfirmPassword]]
    });

  }


  ionViewDidLoad() {

  }


  onSignup() {
    var self = this;
    if (this.signupForm.valid) {
      this.utils.showLoading('Registering....');
      let user = {
        uid: '',
        username: this.signupForm.value.username,
        password: this.signupForm.value.password,
        email: this.signupForm.value.email
      };
      this.medProvid.createUser(user).then((data) => {
        user.uid = data.uid;
        self.medProvid.saveRegisteredUser(user);
        self.utils.loader.dismiss();
        self.navCtrl.push(Home);
      }, (error) => {
        self.utils.showMessage("Error", error.message, "Ok").present();
        self.utils.loader.dismiss();
      });
    }
  }
}
