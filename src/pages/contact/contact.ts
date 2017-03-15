import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User, GlobalStatictVar } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { Conversation } from '../conversation/conversation';
import { Profile } from '../profile/profile';
import { Subscription } from 'rxjs/Subscription';
import { LogProvider } from '../../providers/logProvider';



@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class Contact {


  contacts: User[] = new Array();
  users: User[] = new Array();
  defaultPhoto = GlobalStatictVar.DEFAULT_PROFILE_PHOTO;
  loggedinUser: User;
  itemSubscription: Subscription;
  searchKey = '';

  constructor(public navCtrl: NavController, public medProvid: MediatorProvider, public logProvid: LogProvider) {
  }

  ionViewDidLoad() {
    this.loggedinUser = this.medProvid.loggedinUser;
  }

  ionViewWillEnter() {
    this.initContacts();
    this.loadOnlineUsers(); //Async
  }

  initContacts() {
    this.contacts = new Array();
    var self = this;
    this.medProvid.getContacts().then((data) => {
      self.logProvid.log('ldb contact loaded: '+data.res.rows.length);
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          let user = {
            id: item.id,
            uid: item.uid,
            username: item.username,
            email: item.email,
            photo: item.photo,
            isContact: true
          }
          self.contacts.push(user);
          self.logProvid.log('local contact pushed: '+user.username);
        }
      }
    }, (error) => {
      self.logProvid.log('get contacts error: ' + error);
    });
  }

  search(event: any) {
    //I'm calling this here in case { you may open the app and it's offline
    //but when you are about to type search the app became online }
    //this.loadOnlineUsers();

    var self = this;
    let val: string = event.target.value;
    if (val && val.trim() != '') {
      this.contacts = new Array();
      //filter users contacts ( LocalStorage )
      this.contacts.filter((item) => {
        if (item.username.toLowerCase().includes(val.toLowerCase()) && item.uid != this.loggedinUser.uid) {
          self.contacts.push(item);
        }
      });

      //filter online users
      this.users.filter((item) => {
        if (item.username.toLowerCase().includes(val.toLowerCase()) && item.uid != this.loggedinUser.uid) {
          self.contacts.push(item);
        }
      });

      this.logProvid.log('local contacts: ' + this.contacts.length);
      this.logProvid.log('online contacts: ' + this.users.length);
    } else {
      //reload user's contacts from ( localstorage )
      this.contacts = new Array();
      this.initContacts();
      this.loadOnlineUsers(); //Async
    }
  }

  loadOnlineUsers() {
    //this is not the correct solution to be used when you have a hundreds or more users
    //because this app is just prototype so I use this way to search for users
    //If you are willing to implement a proper full-text search in firebase you should consider using https://github.com/firebase/flashlight
    let items = this.medProvid.getUsers();
    this.users = new Array();
    this.deAttach();
    var self = this;
    this.itemSubscription = items.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        var childData = snapshot.val();
        let user = {
          uid: childData.uid,
          username: childData.username,
          email: childData.email,
          photo: childData.photo,
        }
        self.users.push(user);
        self.logProvid.log('online user pushed: ' + user.username);
      });
    });
  }

  openConversation(user) {
    this.navCtrl.push(Conversation, user);
  }

  openProfile(user) {
    this.navCtrl.push(Profile, { user: user });
  }

  addContact(user) {
    this.medProvid.addContact(this.loggedinUser.uid, user);
    //this.contacts.push(user);
  }

  removeContact(index, contact) {
    this.medProvid.removeContact(contact.id);
    this.contacts.splice(index);
  }

  ionViewWillLeave() {
    this.deAttach();
    this.searchKey = '';
  }

  deAttach() {
    if (this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }
}
