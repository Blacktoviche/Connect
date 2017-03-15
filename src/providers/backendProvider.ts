import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { User, Chat, Message, MessageQueue } from '../shared/interfaces';
import { SqlStorage } from '../shared/SqlStorage';



@Injectable()
export class BackendProvider {


    private storage: SqlStorage;
    user: User;


    constructor(public sqlStorage: SqlStorage) {
        //For browser test
        this.storage = sqlStorage;
        this.initBackend();
    }

    initBackend() {
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, username TEXT, email TEXT, photo TEXT)", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, uid, onlineKey TEXT, fromUid TEXT , toUid TEXT, body TEXT, msgType TEXT, msgDate Integer, msgStatus Integer, sentStatus Integer)", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, uid2 TEXT, datetime Integer,lastMsgText TEXT, lastMsgDate Integer, recieverName TEXT, recieverPhoto TEXT, notify Integer )", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, username TEXT, email TEXT, photo TEXT )", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS msg_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, originalMsgId, uid, onlineKey TEXT, fromUid TEXT, toUid TEXT, body TEXT, msgType TEXT, msgDate Integer, msgStatus Integer, sentStatus Integer )", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS chat_users (id INTEGER PRIMARY KEY AUTOINCREMENT,  uid TEXT, username TEXT, email TEXT, photo TEXT)", []);
        this.initUser();
        console.log('init storage completed ');
    }

    initUser() {
        var self = this;
        this.getUser().then((data) => {
            if (data.res.rows.length > 0) {
                for (let i = 0; i < data.res.rows.length; i++) {
                    let item = data.res.rows.item(i);
                    let user = {
                        id: item.id,
                        uid: item.uid,
                        username: item.username,
                        email: item.email,
                        photo: item.photo
                    }
                    self.user = user;
                }
            }
        }, (error) => {
            console.log('get user error: ' + error);
        });
    }

    saveUser(user: User) {
        return this.storage.executeSql("SELECT * FROM users");
    }

    updateUser(user: User) {
        let query = 'UPDATE Users SET username = ? , email = ?, photo = ? WHERE id = ?';
        return this.storage.executeSql(query, [user.username, user.email, user.photo, user.id]);
    }

    addUser(user: User) {
        this.user = user;
        let query = 'INSERT INTO Users (uid, username, email, photo ) VALUES (?,?,?,?)';
        return this.storage.executeSql(query, [user.uid, user.username, user.email, user.photo]);
    }

    addMessage(message: Message) {
        console.log('saving msg : ');
        let query = 'INSERT INTO Messages (uid, onlineKey, fromUid, toUid, body, msgType, msgDate, msgStatus, sentStatus) VALUES (?,?,?,?,?,?,?,?,?)';
        this.storage.executeSql(query, [message.uid, message.onlineKey, message.from, message.to, message.body, message.type, message.datetime, message.status, message.sentstatus]);
    }

    //onlinekey uses when updating from online to locale so we don't have to retrive the whole messages by using combination of AngularFirebase query 
    //orderByKey and startAt {onlineKey}
    updateMessageOnlinekey(onlineKey, id) {
        let query = 'UPDATE messages SET onlineKey = ? WHERE id = ?';
        this.storage.executeSql(query, [onlineKey, id]);
    }

    updateMessageStatusSent(id, sentstatus) {
        let query = 'UPDATE messages SET sentStatus = ? WHERE id = ?';
        this.storage.executeSql(query, [sentstatus, id]);
    }

    removeMessage(messageId) {
        let query = 'DELETE FROM Messages WHERE id = ?';
        this.storage.executeSql(query, [messageId]);
    }

    addChat(chat: Chat) {
        let query = 'INSERT INTO Chats (uid, uid2, datetime, lastMsgText, lastMsgDate, recieverName, recieverPhoto, notify) VALUES (?,?,?,?,?,?,?,?)';
        return this.storage.executeSql(query, [chat.uid, chat.uid2, chat.datetime, chat.lastMsgText, chat.lastMsgDate, chat.recieverName, chat.recieverPhoto, chat.notify]);
    }


    //This is the user which you chat with him/her but not added to contact
    addChatUser(user: User) {
        var self = this;
        //To be sure there is no duplicat chat for single user
        let query0 = 'SELECT * FROM chat_users WHERE  uid = ? ORDER BY id DESC LIMIT 1';
        this.storage.executeSql(query0, [user.uid]).then((data) => {
            if (data.res.rows.length > 0) {
                let item = data.res.rows.item(0);
                let query = 'UPDATE chat_users SET username = ?, email = ?, photo = ? WHERE id = ?';
                self.storage.executeSql(query, [user.username, user.email, user.photo, item.id]);
            } else {
                let query = 'INSERT INTO chat_users (uid, username, email, photo ) VALUES (?,?,?,?)';
                self.storage.executeSql(query, [user.uid, user.username, user.email, user.photo]);
            }
        }, (error) => {
            console.log(error);
        });
    }

    updateChat(chat: Chat) {
        console.log('update chat notify: ' + chat.notify);
        let query = 'UPDATE chats SET datetime = ?, lastMsgText = ?, lastMsgDate = ?, recieverPhoto = ?, notify = ? WHERE id = ?';
        return this.storage.executeSql(query, [chat.datetime, chat.lastMsgText, chat.lastMsgDate, chat.recieverPhoto, chat.notify, chat.id]);
    }

    removeChat(chat: Chat) {
        let query = 'DELETE FROM chats WHERE id = ?';
        this.storage.executeSql(query, [chat.id]);

        //Delete user object which connected to this chat
        let query2 = 'DELETE FROM chat_users WHERE uid = ?';
        this.storage.executeSql(query2, [chat.uid2]);

        //Delete messages which connected to this chat
        let query3 = 'DELETE FROM Messages WHERE ( fromUid = ? AND toUid = ? ) OR ( fromUid = ? AND toUid = ? )';
        this.storage.executeSql(query3, [chat.uid, chat.uid2, chat.uid2, chat.uid]);
    }

    //Testing method
    removeAllChats() {
        let query = 'DELETE FROM chats';
        this.storage.executeSql(query);
        let query2 = 'DELETE FROM chat_users';
        this.storage.executeSql(query2);
        let query3 = 'DELETE FROM Messages';
        this.storage.executeSql(query3);
    }

    //There won't be two users for the same chat ofcourse but using uid & limit is just for being sure
    getChatUser(uid) {
        let query = 'SELECT * FROM chat_users WHERE uid = ? ORDER BY id DESC LIMIT 1;';
        return this.storage.executeSql(query, [uid]);
    }

    getUser() {
        return this.storage.executeSql("SELECT * FROM users");
    }

    getContacts() {
        return this.storage.executeSql("SELECT * FROM contacts");
    }

    addContact(user) {
        let query = 'INSERT INTO contacts (uid, username, email, photo ) VALUES (?,?,?,?)';
        return this.storage.executeSql(query, [user.uid, user.username, user.email, user.photo]);
    }

    removeContact(contactId) {
        let query3 = 'DELETE FROM contacts WHERE id = ?';
        this.storage.executeSql(query3, [contactId]);
    }

    getMessages(uid, uid2) {
        //Get messages sent/recieved between me (uid) and the other user (uid2) 
        let query = 'SELECT * FROM Messages WHERE ( fromUid = ? AND toUid = ? ) OR ( fromUid = ? AND toUid = ? )';
        return this.storage.executeSql(query, [uid, uid2, uid2, uid]);
    }

    getChats() {
        let query = 'SELECT * FROM chats ORDER BY datetime ASC';
        return this.storage.executeSql(query);
    }


    //There is only one chat object between two users { using limit just in case }
    getChat(uid, uid2) {
        let query = 'SELECT * FROM chats WHERE ( uid = ? AND uid2 = ? ) OR ( uid = ? AND uid2 = ? ) LIMIT 1;';
        return this.storage.executeSql(query, [uid, uid2, uid2, uid]);
    }


    addMessageQueue(message: MessageQueue) {
        let query = 'INSERT INTO msg_queue ( originalMsgId, uid, onlineKey, fromUid, toUid, body, msgType, msgDate, msgStatus,sentStatus) VALUES (?,?,?,?,?,?,?,?,?,?)';
        this.storage.executeSql(query, [message.originalMsgId, message.uid, message.onlineKey, message.from, message.to, message.body, message.type, message.datetime, message.status, message.sentstatus]);
    }


    removeMessageQueue(messageId) {
        let query = 'DELETE FROM msg_queue WHERE id = ?';
        this.storage.executeSql(query, [messageId]);
    }

    getMessagesQueue() {
        let query = 'SELECT * FROM msg_queue';
        return this.storage.executeSql(query);
    }
}