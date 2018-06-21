import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  uid: any;
  loader: any;
  constructor(public platform: Platform, private fileChooser: FileChooser, public iosFilePicker: IOSFilePicker, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,public toast: ToastController) {
    this.uid = navParams.get('userData');

  }

  uploadDocument() {    
    if (this.platform.is('ios')) {
      this.pickFileFromIOSDevice();
    }
    else if (this.platform.is('android')) {
      this.pickFileFromAndroidDevice();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

   pickFileFromIOSDevice() {
    this.iosFilePicker.pickFile().then(uri => {
      this.loader = this.loadingCtrl.create({
      content: "uploading...",
    });
    this.loader.present();
        (<any>window).FilePath.resolveNativePath(uri, (result) => {
        this.readimage(result);
      });
      }).catch(error => {
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
            this.inserUserIDNumberPasswordImage(imgBlob, this.uid)
          }
        })
      })
    }
  }

  pickFileFromAndroidDevice() {
    this.fileChooser.open().then(uri => {
      this.loader = this.loadingCtrl.create({
      content: "uploading...",
    });
    this.loader.present();
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

  inserUserIDNumberPasswordImage(file, userId) {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child('ProofOfPayment/' + userId);
    imageRef.put(file).then(snapshot => {
      this.showError('Proof of payment is successful.');
      this.updateUser();
       this.loader.dismiss();
    });
  }

  updateUser() {
    var updates = {};
    updates['users/' + this.uid + '/uploadedPOP'] = true;
    firebase.database().ref().update(updates);
  }

}
