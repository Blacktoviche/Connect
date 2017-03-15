import { Component, Output } from '@angular/core';
import { Camera, CameraOptions } from 'ionic-native';
import { Login } from '../login/login';
import { Signup } from "../signup/signup";
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Main } from "../main/main";
import { MediatorProvider } from '../../providers/mediatorProvider';
import { UtilsProvider } from '../../providers/utilsProvider';
import { User, GlobalStatictVar } from '../../shared/interfaces';
import { Conversation } from '../conversation/conversation';
import { LogProvider } from '../../providers/logProvider';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class Profile {

  defaultPhoto = GlobalStatictVar.DEFAULT_PROFILE_PHOTO;
  profileBG = '../assets/imgz/nycbw.jpg';
  loggedinUser: User;
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public utils: UtilsProvider, public medProvid: MediatorProvider, public logProvid: LogProvider) {
    this.loggedinUser = this.medProvid.loggedinUser;
    this.user = this.loggedinUser;
    this.logProvid.log('const: user: ' + this.user);
  }

  ionViewDidLoad() {
    this.logProvid.log('ionViewDidLoad: loggedinUserId: ' + this.user);
  }

  ionViewWillEnter() {
    this.logProvid.log('ionViewWillEnter: loggedinUserId: ' + this.user);
    this.initProfile();
  }

  initProfile() {
    let user = this.navParams.get("user");
    if (user) {
      this.user = user;
    } else {
      this.logProvid.log('initProfile:: ' + this.loggedinUser);
      this.user = this.loggedinUser;
    }
  }

  addContact() {
    this.user.isContact = true;
    this.medProvid.addContact(this.loggedinUser.uid, this.user);
  }

  openConversation() {
    this.navCtrl.push(Conversation, this.user);
  }

  logout() {
    //
  }

  onChangePhoto() {
    if (this.user != this.loggedinUser) {
      return;
    }

    let alert = this.alertCtrl.create({
      message: 'Choose Target',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.openCamera();
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.openGallery();
          }
        }
      ]
    });
    alert.present();
  }

  openCamera() {
    var self = this;
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
    };

    Camera.getPicture(cameraOptions).then((imageData) => {
      self.user.photo = 'data:image/jpeg;base64,' + imageData;
      self.medProvid.updateUserPhoto(self.user);
    }, (err) => {
      this.utils.showMessage("Error", err.message, "Ok").present();
    });
  }

  openGallery(): void {
    var self = this;
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };

    Camera.getPicture(cameraOptions).then((imageData) => {
      self.user.photo = 'data:image/jpeg;base64,' + imageData;
      self.medProvid.updateUserPhoto(self.user);
    }, (err) => {
      this.utils.showMessage("Error", err.message, "Ok").present();
    });

  }
}
