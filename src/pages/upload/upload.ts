import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { LoadingController } from 'ionic-angular';

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

  files =
  [
      {
          name: "mash.pdf"
      },
      {
          name: "Once an Addict.mp3"
      },
      {
          name: "shudu?.pdf"
      }
  ];
  showUploadButton = true;
  rootDirectory = 'file:///';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public fileNavigator: File, public loadingCtrl: LoadingController)
  {

  }

  listDirectories()
  {
      this.showUploadButton = false;
     /* this.fileNavigator.listDir(this.rootDirectory, '').then((data)=>
        {
            this.files = data;
        }); */
  }

  uploadDocument()
  {
    let loader = this.loadingCtrl.create({
      content: "uploading...",
    });

    loader.present();

    setTimeout(() => {
      loader.dismiss();
      this.showUploadButton = true;
    }, 3000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

}
