import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LogProvider } from '../../providers/logProvider';




@Component({
  selector: 'page-log-page',
  templateUrl: 'log-page.html'
})
export class LogPage {

  logArray: any[] = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams, public logProvid: LogProvider) {

  }

  ionViewWillEnter() {
    this.logArray = this.logProvid.logArray;
  }
}
