# Connect
Connect is a realtime messaging app it use firebase as an online backend and SQlite as local storage and AngularFire2 to do some connection with firebase ( login, signup etc )
There are two database a local one and online one and there are syncing between them 
right now I implemented syncing messages and user information so you don’t have to be online every time you want to read your old messages also you send message offline and the app came online it starts syncing ( sending & reading messages ).
I used Events technique inside the app it’s the best way to implements user interface update when message arrived
The backend consist of two providers ( one for firebase and the other for SQlite ) and there is a mediator provider which the view talks to and the mediator start  choose the right action direction ( to the online database or the offline one )

If you want to know my story about this projct and Ionic2 you can click hear read
[https://forum.ionicframework.com/t/simple-chat-app-using-ionic2-angularfire2-firebase-sqlite/83358](https://forum.ionicframework.com/t/simple-chat-app-using-ionic2-angularfire2-firebase-sqlite/83358)


Sql interface credit goes to (https://github.com/seand88/ionic2-sql-interface)


## Plugins

- [AngularFire2](https://github.com/angular/angularfire2/)
- [Cordova SQlite](https://github.com/litehelpers/Cordova-sqlite-storage)
- [Firebase](https://firebase.google.com)

## Installation
- Clone this repo
- `npm install`
- `ionic lab`
