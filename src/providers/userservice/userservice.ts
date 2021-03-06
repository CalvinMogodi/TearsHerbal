import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase'


/*
  Generated class for the UserserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserserviceProvider {

  public data: any;
  public fireAuth: any;
  public userProfile: any;
  public uid: any;
  constructor() {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('users')
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signUpUser(account: {}): any {
    return this.fireAuth.createUserWithEmailAndPassword(account['email'], account['password']).then((newUser) => {
      //
      
      //this.fireAuth.signInWithEmailAndPassword(account['email'], account['password']).then((authenticatedUser) => {
        account['password'] = '';
        account['confirmPassword'] = '';
        this.userProfile.child(newUser.uid).set(
          account
        );
     // });
    });

  }

  userHasUploadedPOP(key: string): any {
    var updates = {};
    updates['users/' + key + '/hasUploadedPOP'] = true;
    return firebase.database().ref().update(updates);
  }
  
  setUid(uid)
  {
      this.uid = uid;
  }
   
  getUid() : any
  { 
      return this.uid;
  }
}
