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
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';

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
      Storage, public toast: ToastController, public File: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, private base64: Base64) {

    this.userId = navParams.get('profileId');
    let storageRef = firebase.storage().ref();
    var starsRef = storageRef.child('profileImages/' + this.userId);
    starsRef.getDownloadURL().then(url => {
      this.profilePicURL = url;
    });


    var test = this.userserviceProvider.getUid();
    var id = null;
    this.database = firebase.database();
    this.storageRef = firebase.storage().ref();

    //get user by uid
    this.database.ref().child('users/' + this.userId).once('value', (snapshot) => {
      this.user = snapshot.val();
      this.showForm = true;
    });
  }

  updateUser(showError) {
    this.database.ref().child('users/' + this.userId).update(this.user);
    if(showError)
      this.showError('Your details are changed successful.');
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
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      ...useAlbum ? { sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM } : {}
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.inserUserImage(base64Image, this.userId);
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

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file.toLowerCase();
  }

  readimage(result) {
    var type = '';
    
    if (this.getfileext(result) == 'pdf') {
      var type = 'application/pdf';
    } else if (this.getfileext(result) == 'jpeg' || this.getfileext(result) == 'png' || this.getfileext(result) == 'jpg') {
      var type = 'image/jpeg';
    }
    if (type == '') { 
      this.showError('You can only upload PDF or image');    }    
    else {
     (<any>window).resolveLocalFileSystemURL(result, (res) => {
        res.file((resFile) => {
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob = new Blob([evt.target.result], { type: type });
            this.inserUserIDNumberPasswordImage(imgBlob, this.userId)
          }
        })
      })
    }

  }

  pickFileFromAndroidDevice() {
    this.showError('Android.');
    this.fileChooser.open().then(uri => {
      this.showError(uri);
      (<any>window).FilePath.resolveNativePath(uri, (result) => {
        this.readimage(result);

      });
    }).catch(error => {
      this.showError(error);
    });
  }

  showError(str) {
    let toast = this.toast.create({
      message: str,
      duration: 10000,
      position: 'top'
    });
    toast.present();
  }

  inserUserImage(file, userId) {
    var storageRef = firebase.storage().ref();
    var mountainImagesRef = storageRef.child('profileImages/' + userId);
    mountainImagesRef.putString(file, 'data_url').then(snapshot => {
      snapshot.ref.getDownloadURL().then(downloadURL => {
        this.profilePicURL = downloadURL;
        this.showError('Profile image is changed successful.');
      });
    });

  }

  inserUserIDNumberPasswordImage(file, userId) {
    var storageRef = firebase.storage().ref();
    var imageRef = this.storageRef.child('IDNumberPassport/' + userId);
    imageRef.put(file).then(snapshot => {
      this.user.uploadedIDNumberPassport = true;
      this.showError('ID Number/ Passport image is changed successful.');
      this.updateUser(false);
    });
  }

}
