import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { ForgotPassword } from "../pages/forgot-password/forgot-password";
import { Profile } from "../pages/profile/profile";
import { Contact } from "../pages/contact/contact";
import { Login } from "../pages/login/login";
import { Signup } from "../pages/signup/signup";
import { Chats } from "../pages/chats/chats";
import { LogPage } from "../pages/log-page/log-page";
import { Conversation } from '../pages/conversation/conversation';
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { AuthProvicer } from '../providers/authProvicer';
import { UtilsProvider } from '../providers/utilsProvider';
import { OnlineProvider } from '../providers/onlineProvider';
import { BackendProvider } from '../providers/backendProvider';
import { MediatorProvider } from '../providers/mediatorProvider';
import { LogProvider } from '../providers/logProvider';
import { SqlStorage } from '../shared/SqlStorage';



export const firebaseConfig = {
  apiKey: "AIzaSyBt3sGw84MSROR2iDpQCcM6ED_oBVnOps4",
  authDomain: "simplechat-8bed4.firebaseapp.com",
  databaseURL: "https://simplechat-8bed4.firebaseio.com",
  storageBucket: "simplechat-8bed4.appspot.com",
  messagingSenderId: "824888123229"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}


@NgModule({
  declarations: [
    MyApp,
    Home,
    Login,
    Signup,
    Chats,
    Contact,
    Profile,
    ForgotPassword,
    Conversation,
    LogPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Login,
    Signup,
    Chats,
    Contact,
    Profile,
    ForgotPassword,
    Conversation,
    LogPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, AuthProvicer, UtilsProvider, SqlStorage, Storage,
  MediatorProvider, OnlineProvider, BackendProvider, LogProvider]
})
export class AppModule { }
