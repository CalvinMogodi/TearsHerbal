import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { FileChooser } from '@ionic-native/file-chooser';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userId: any;
  public database: any;
  public showForm = false;
  public user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public platform: Platform,private fileChooser: FileChooser,
    public userserviceProvider: UserserviceProvider, public storage:
      Storage) {
    //this.userId = "ZKZ7NFGg9zQior7fMHMnwRgD2qs2";
    this.userId = navParams.get('profileId');
    var test = this.userserviceProvider.getUid();
    var id = null;

    //var id = this.storage.get(':"{"uid":"ZKZ7NFGg9zQior7fMHMnwRgD2qs2","displayName":null,"photoURL":null,"email":"g@g.com","emailVerified":false,"identifierNumber":null,"isAnonymous":false,"providerData":[{"uid":"g@g.com","displayName":null,"photoURL":null,"email":"g@g.com","providerId":"password"}],"apiKey":"AIzaSyDNZ2-urHkW0xoe9rh9aexpp__FeHybkb8","appName":"[DEFAULT]","authDomain":"terasherbal-7694e.firebaseapp.com","stsTokenManager":{"apiKey":"AIzaSyDNZ2-urHkW0xoe9rh9aexpp__FeHybkb8","refreshToken":"AK2wQ-yFFQ4G-9sn0ZQrIKvR5HJ-B_yg54dVFKB_TKrq)
    //this.storage.set("tessssssssssst", test);
    this.database = firebase.database();

    //get user by uid
    this.database.ref().child('users/' + this.userId).once('value', (snapshot) => {
      this.user = snapshot.val();
      this.showForm = true;
    });
  }

  updateUser() {
    this.database.ref().child('users/' + this.userId)
      .update(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  pickFile() {
    if (this.platform.is('ios')) {
      this.pickFileFromIOSDevice();
    }
    else if (this.platform.is('android')) {
      this.pickFileFromAndroidDevice();
    }
  }

  pickFileFromIOSDevice() {
   /* this.filePicker.pickFile()
      .then(
      uri => {
       // this.file = uri;
      }
      )
      .catch(error => {
      //  this.showError(error);
      });*/
  }

  pickFileFromAndroidDevice() {
    this.fileChooser.open().then(
      uri => console.log(uri)).catch(error => {
       // this.showError(error);
      });
  }

}
