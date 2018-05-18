import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { LoadingController } from 'ionic-angular';
import { UserserviceProvider } from '../../providers/userservice/userservice';

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
 uid : any;
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
              public fileNavigator: File, public loadingCtrl: LoadingController, public userService: UserserviceProvider)
  {
    this.uid = navParams.get('userData');

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
     this.userService.userHasUploadedPOP(this.uid).then(authData => {
 setTimeout(() => {
      loader.dismiss();
      this.showUploadButton = true;
    }, 3000);
     });
   


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

}
