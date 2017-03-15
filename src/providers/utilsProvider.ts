import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';



@Injectable()
export class UtilsProvider {

    loader: any;

    constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController) { }

    showMessage(title, message, buttonText) {
        console.log(message);
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [buttonText]
        });
        return alert;
    }

    showLoading(msg) {
        this.loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: msg,
            dismissOnPageChange: true
        });
        this.loader.present();
    }


    showError(errorMsg) {
        let prompt = this.alertCtrl.create({
            title: 'Fail',
            subTitle: errorMsg,
            buttons: ['OK']
        });
        prompt.present();
    }

}