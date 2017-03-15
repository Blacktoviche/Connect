import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { User } from '../shared/interfaces';


@Injectable()
export class AuthProvicer {


  constructor(public af: AngularFire) {

  }

  updateUser(user: User) {
    let currentUserRef = this.af.database.object(`/users/${user.uid}`);
    currentUserRef.set({
      id: user.id,
      uid: user.uid,
      username: user.username,
      email: user.email,
      photo: user.photo
    });
  }

}
