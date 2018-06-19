import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { ToastController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  public storageRef: any;
  profilePicURL = 'assets/imgs/profile.png';
  public file: File;
  constructor(public camera: Camera, public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private fileChooser: FileChooser, public iosFilePicker: IOSFilePicker,
    public userserviceProvider: UserserviceProvider, public storage:
      Storage, public toast: ToastController, public File: File, public actionSheetCtrl: ActionSheetController) {
    this.userId = navParams.get('profileId');
    let storageRef = firebase.storage().ref();
    var starsRef = storageRef.child('profileImages/' + this.userId);
    starsRef.getDownloadURL().then(url => {
      this.profilePicURL = url;
    });

    var test = this.userserviceProvider.getUid();
    var id = null;

    //var id = this.storage.get(':"{"uid":"ZKZ7NFGg9zQior7fMHMnwRgD2qs2","displayName":null,"photoURL":null,"email":"g@g.com","emailVerified":false,"identifierNumber":null,"isAnonymous":false,"providerData":[{"uid":"g@g.com","displayName":null,"photoURL":null,"email":"g@g.com","providerId":"password"}],"apiKey":"AIzaSyDNZ2-urHkW0xoe9rh9aexpp__FeHybkb8","appName":"[DEFAULT]","authDomain":"terasherbal-7694e.firebaseapp.com","stsTokenManager":{"apiKey":"AIzaSyDNZ2-urHkW0xoe9rh9aexpp__FeHybkb8","refreshToken":"AK2wQ-yFFQ4G-9sn0ZQrIKvR5HJ-B_yg54dVFKB_TKrq)
    //this.storage.set("tessssssssssst", test);
    this.database = firebase.database();
    this.storageRef = firebase.storage().ref();

    //get user by uid
    this.database.ref().child('users/' + this.userId).once('value', (snapshot) => {
      this.user = snapshot.val();
      this.showForm = true;
    });
  }

  updateUser() {
    this.database.ref().child('users/' + this.userId).update(this.user);
    // this.file = new File("../assets/imgs/6lack.jpg");
    //this.file = ;
    this.inserUserImage(this.file, this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  openeditprofile() {
    let actionSheet = this.actionSheetCtrl.create({

      buttons: [
        {
          text: 'Take Photo',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.captureImage(false);
          }
        },
        {
          text: 'Choose Photo From Gallery',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.captureImage(true);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  async captureImage(useAlbum: boolean) {
    this.showError(this.userId);
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      ...useAlbum ? { sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM } : {}
    }

    this.camera.getPicture(options).then((imageData) => {

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      let toast = this.toast.create({
        message: base64Image,
        duration: 100000,
        position: 'top'
      });
      toast.present();
      //this.inserUserImage(base64Image, this.userId + 1);
    }, (err) => {
      this.showError(err);
    });

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
    this.iosFilePicker.pickFile()
      .then(
      uri => {
        //var ef = this.file.getFile(uri, '',true);        
      }
      )
      .catch(error => {
        this.showError(error);
      });
  }

  pickFileFromAndroidDevice() {
    this.fileChooser.open().then(uri => {
      //this.file = uri;
    }).catch(error => {
      this.showError(error);
    });
  }

  showError(str) {
    let toast = this.toast.create({
      message: str,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  inserUserImage(file, userId) {
    // Create a root reference
    var storageRef = firebase.storage().ref();


    // Create a reference to 'images/mountains.jpg'
    var mountainImagesRef = storageRef.child('IDNumberPassword/' + userId);
    this.showError('Uploading');

    mountainImagesRef.putString(file, 'data_url').then(function (snapshot) {
      this.showError('Uploaded a base64 string!');
      console.log('Uploaded a data_url string!');
    });
  }

  inserUserIDNumberPasswordImage(file, userId) {
    var imageRef = this.storageRef.child('IDNumberPassword/' + userId);
    imageRef.put(file).then(function (snapshot) { });
  }

}
