import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Chats } from '../chats/chats'
import { Contact } from '../contact/contact'
import { Profile } from '../profile/profile'
import { MediatorProvider } from '../../providers/mediatorProvider';
import { LogProvider } from '../../providers/logProvider';
import { LogPage } from "../log-page/log-page";
import { GlobalStatictVar } from "../../shared/interfaces";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  tab1Root: any = Chats;
  tab2Root: any = Contact;
  tab3Root: any = Profile;
  tab4Root: any = LogPage;

  @Input()
  newMsgCount: number = 0;
  @Input()
  headerColor = 'dark';

  constructor(public navCtrl: NavController, public medProvid: MediatorProvider, public events: Events, public logProvid: LogProvider
    , public changeDetectionRef: ChangeDetectorRef) {
    events.subscribe(GlobalStatictVar.NOTIFICATION_EVENT, (notify) => {
      this.logProvid.log('notify: ' + notify);
      if (notify) {
        this.newMsgCount++;
      } else {
        this.newMsgCount--;
      }
      this.changeDetectionRef.detectChanges();
    });

    events.subscribe(GlobalStatictVar.ONLINE_EVENT, () => {
      this.headerColor = 'secondary';
    });
    events.subscribe(GlobalStatictVar.OFFLINE_EVENT, () => {
      this.headerColor = 'dark';
    });
  }
}
