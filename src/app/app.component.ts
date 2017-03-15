import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { Login } from '../pages/login/login';
import { Home } from '../pages/home/home';
import { MediatorProvider } from '../providers/mediatorProvider';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, public angularFire: AngularFire, public medProvid: MediatorProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
	  medProvid.initLocaleDB();
      this.intialize();
    });
  }
   intialize() {
    this.angularFire.auth.subscribe(auth => {
      if (auth) {
        this.rootPage = Home;
      } else {
        this.rootPage = Login;
      }
    });
  }
}
