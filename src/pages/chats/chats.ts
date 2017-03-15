import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavParams, NavController, Events } from 'ionic-angular';
import { GlobalStatictVar } from '../../shared/interfaces';
import { App } from 'ionic-angular';
import { Conversation } from '../conversation/conversation';
import { Chat } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { LogProvider } from '../../providers/logProvider';

@Component({
  selector: 'page-chat',
  templateUrl: 'chats.html',
})
export class Chats {

  @Input()
  chats: Chat[] = new Array();
  defaultPhoto = GlobalStatictVar.DEFAULT_PROFILE_PHOTO;
  chatMap = new Map();


  constructor(private app: App, public navCtrl: NavController, public medProvid: MediatorProvider, public events: Events,
    public logProvid: LogProvider, public changeDetectionRef: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    this.events.subscribe(GlobalStatictVar.NEW_MESSAGE_EVENT, (message, senderUser) => {
      this.messageArrived(message, senderUser);
    });
  }

  ionViewWillEnter() {
    this.initChats();
    //this.medProvid.removeAllChats();
    this.logProvid.log('chats loaded!');
  }

  initChats() {
    this.chats = new Array();
    this.chatMap.clear();
    var self = this;
    this.medProvid.getChats().then((data) => {
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          let currChat = {
            id: item.id,
            uid: item.uid,
            uid2: item.uid2,
            datetime: item.datetime,
            lastMsgText: item.lastMsgText,
            lastMsgDate: item.lastMsgDate,
            recieverName: item.recieverName,
            recieverPhoto: item.recieverPhoto,
            notify: item.notify,
            user: undefined
          }
          //Sometimes I'm not sure what is happening with the date pipe in chat.html so I wanted to be sure nothing wrong with the view
          //Just in testing case 
          if (item.lastMsgDate === undefined) {
            currChat.lastMsgDate = new Date().getTime();
          }

          //Fill user in chat as object to get photo etc
          self.medProvid.getChatUser(currChat.uid2).then((data) => {
            if (data.res.rows.length > 0) {
              let item = data.res.rows.item(0);
              currChat.user = {
                uid: item.uid,
                username: item.username,
                email: item.email,
                photo: item.photo
              }
            }
            self.chats.push(currChat);
            self.chatMap.set(currChat.uid2, currChat);
            self.logProvid.log('chat notify: ' + currChat.notify);
            if (currChat.notify == 1) {//Fire notification event to add badge in chat tab
              self.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, true);
            }
          });
        }
      }
    }, (error) => {
      self.logProvid.log('error getting chat: ' + error);
    });

    this.chats.sort(function (val1, val2) {
      return val1.lastMsgDate - val2.lastMsgDate;
    });
  }

  ionViewWillUnload() {
    this.logProvid.log('view unloaded!');
    this.events.unsubscribe(GlobalStatictVar.NEW_MESSAGE_EVENT);
  }
  
  messageArrived(message, senderUser) {
    var self = this;
    let chat: Chat = this.chatMap.get(message.from);
    if (chat) {
      chat.lastMsgDate = message.datetime;
      chat.lastMsgText = message.body;
      chat.recieverPhoto = senderUser.photo;
      chat.notify = 1;
      this.logProvid.log('message new pushed ');
      this.chats.sort(function (val1, val2) {
        return val1.lastMsgDate - val2.lastMsgDate;
      });
      this.changeDetectionRef.detectChanges();
      this.medProvid.updateChat(chat);//Update the notify 
    } else {//This means it's a new chat 
      this.medProvid.getChat(message.from, message.to).then((data) => {
        if (data.res.rows.length > 0) {
          let item = data.res.rows.item(0);
          let chat = {
            id: item.id,
            uid: item.uid,
            uid2: item.uid2,
            datetime: item.datetime,
            lastMsgText: message.body,
            lastMsgDate: message.datetime,
            recieverName: senderUser.username,
            recieverPhoto: senderUser.photo,
            user: senderUser,
            notify: 1
          }
          self.logProvid.log('chat new pushed ');
          //self.chats.push(chat);
          self.chats.unshift(chat);
          self.chatMap.set(chat.uid2, chat);
          self.changeDetectionRef.detectChanges();
          self.medProvid.updateChat(chat);
        }
      });
    }

    //Update chat tab badge
    self.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, true);
  }
  openConversation(user) {
    this.navCtrl.push(Conversation, user);
  }

  removeChat(index, chat) {
    this.medProvid.removeChate(chat);
    this.chatMap.delete(chat.uid2);
    this.chats.splice(index);
  }

  isToday(date) {
    let today = new Date();
    let chatDate = new Date(date);
    if (today.getFullYear() === chatDate.getFullYear() && today.getMonth() === chatDate.getMonth() && today.getDate() === chatDate.getDate()) {
      return true;
    } else {
      return false;
    }
  }

  isYesterday(date) {
    let todayDate = new Date();
    let chatDate = new Date(date);
    if (todayDate.getFullYear() === chatDate.getFullYear() && todayDate.getMonth() === chatDate.getMonth()) {
      if (todayDate.getDate() - chatDate.getDate() == 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
