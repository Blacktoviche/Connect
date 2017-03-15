import { Component, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { NavParams, Events, Content } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { User, Chat, Message, GlobalStatictVar } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { LogProvider } from '../../providers/logProvider';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class Conversation {

  message: string;

  loggedinUser: User;
  user: User;
  title: string;
  chat: Chat;
  @Input()
  messages: Message[] = new Array();
  @ViewChild(Content) chatContainer: Content;

  //User status if he is in this page or not { using the ionic lifecycle events }
  //if you want to know more about navigating lifecycle events in ionic go here http://blog.ionic.io/navigating-lifecycle-events/
  isUserHere: boolean = false;

  constructor(private navParam: NavParams, public medProvid: MediatorProvider, public events: Events, public logProvid: LogProvider
    , public changeDetectionRef: ChangeDetectorRef) {
    this.user = this.navParam.data;
    events.subscribe(GlobalStatictVar.NEW_MESSAGE_EVENT, (message, sender) => {
      this.messageArrived(message, sender);
    });
  }


  ionViewDidLoad() {
    //we only need this call for one time when view loaded to cach
    this.loggedinUser = this.medProvid.loggedinUser;
    //this.scrollChat();
  }

  ionViewWillEnter() {
    //this must be call everytime user enter this page
    this.user = this.navParam.data;
    this.initChats();
    this.isUserHere = true;
  }

  ionViewDidEnter() {
    this.scrollChat();
  }

  initChats() {
    this.messages = new Array();
    var self = this;
    this.medProvid.getChat(this.loggedinUser.uid, this.user.uid).then((data) => {
      if (data.res.rows.length > 0) {
        let item = data.res.rows.item(0);
        self.chat = {
          id: item.id,
          uid: item.uid,
          uid2: item.uid2,
          datetime: item.datetime,
          lastMsgText: item.lastMsgText,
          lastMsgDate: item.lastMsgDate,
          recieverName: item.recieverName,
          recieverPhoto: item.recieverPhoto,
          notify: item.notify
        }
        if (self.chat.notify == 1) {//The chat is being read so I should remove the budge from chat tab
          self.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, false);
          self.chat.notify = 0;
          self.medProvid.updateChat(this.chat);
        }
      } else {

        self.chat = {
          uid: this.loggedinUser.uid,
          uid2: this.user.uid,
          datetime: new Date().getTime(),
          lastMsgText: "",
          lastMsgDate: new Date().getTime(),
          recieverName: this.user.username,
          recieverPhoto: this.user.photo,
          notify: 0
        }
        this.medProvid.addChat(this.chat);
        self.medProvid.addChatUser(self.user);
      }
    }, (error) => {
      this.logProvid.log('error getting chats: ' + error);
    });

    this.medProvid.getMessages(self.loggedinUser.uid, self.user.uid).then((data) => {
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          let currMsg = {
            id: item.id,
            uid: item.uid,
            from: item.fromUid,
            to: item.toUid,
            body: item.body,
            type: item.msgType,
            datetime: item.msgDate,
            status: item.msgStatus,
          }
          self.messages.push(currMsg);
          self.scrollChat();
        }
      }
    }, (error) => {
      this.logProvid.log(error);
    });

    this.logProvid.log('Chat messages count: ' + self.messages.length);
    this.messages.sort(function (val1, val2) {
      return val1.datetime - val2.datetime;
    });
  }

  send(input: any) {

    //no place for empty msg
    if (!this.message || this.message.trim() == '') {
      return;
    }

    let msg = {
      uid: this.loggedinUser.uid,
      from: this.loggedinUser.uid,
      to: this.user.uid,
      body: this.message,
      type: GlobalStatictVar.MSG_TYPE_MSG,
      datetime: new Date().getTime(),
      status: GlobalStatictVar.MSG_STATUS_UN_READ,
      sentstatus: GlobalStatictVar.MSG_STATUS_SENT
    }


    //If the online status false message will be put in Firebase queue and I don't want this
    //I'm using my own queue here 
    if (this.medProvid.onlineStatus) {
      this.medProvid.sendMessage(msg);
      this.logProvid.log('msg sent!');
    } else {
      //online DB is offline add msg to queue
      msg.sentstatus = GlobalStatictVar.MSG_STATUS_UN_SENT;
      this.medProvid.addMessageToQueue(msg);
      this.logProvid.log('msg queued!');
    }

    this.updateChat(this.chat, msg.body, msg.datetime);
    this.messages.push(msg);
    this.message = "";

    this.scrollChat();
    input.setFocus();
    this.changeDetectionRef.detectChanges();
    this.logProvid.log('check chat: ' + this.chat.id);
  }


  updateChat(chat, lastMsgText, lastMsgDate) {
    //call this update on every message sent/recieve
    //I can make this call in ionViewWillLeave but in some cases app may crash or user just close it 
    //so I make sure chat vars are up to date in local db
    chat.lastMsgText = lastMsgText;
    chat.lastMsgDate = lastMsgDate;
    this.medProvid.updateChat(chat);
  }

  scrollChat() {
    this.chatContainer.scrollToBottom(300);
  }

  ionViewWillLeave() {
    //Chat must be deleted if there were no messages between users
    if (this.messages.length == 0) {
      this.medProvid.removeChate(this.chat);
      this.logProvid.log('empty chat deleted');
    }
    this.deAttach();
    this.isUserHere = false;
  }

  deAttach() {
    if (this.events) {
      this.events.unsubscribe(GlobalStatictVar.NEW_MESSAGE_EVENT);
    }
  }

  messageArrived(message, senderUser) {
    if (this.isUserHere) {
      if (this.user.uid == message.uid) {
        this.messages.push(message);
        this.scrollChat();
        this.changeDetectionRef.detectChanges();
        this.logProvid.log('message pushed: ');
        this.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, false);
      }
    }
  }
}
