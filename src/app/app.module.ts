import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { Base64 } from '@ionic-native/base64';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { TermsandconditionsPage } from '../pages/termsandconditions/termsandconditions';
import { OrderdetailsPage } from '../pages/orderdetails/orderdetails';
import { RegisterPage } from '../pages/register/register';
import { UploadPage } from '../pages/upload/upload';
import { OrderPage } from '../pages/order/order';
import { OrderhistoryPage } from '../pages/orderhistory/orderhistory';
import { CartPage } from '../pages/cart/cart';
import { ProfilePage } from '../pages/profile/profile';
import { AwaitingApprovalPage } from '../pages/awaitingapproval/awaitingapproval';
import { CardpaymentPage } from '../pages/cardpayment/cardpayment';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as firebase from 'firebase'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserserviceProvider } from '../providers/userservice/userservice';

import { IonicStorageModule } from '@ionic/storage';

export const firebaseConfig = {
    apiKey: "AIzaSyDNZ2-urHkW0xoe9rh9aexpp__FeHybkb8",
    authDomain: "terasherbal-7694e.firebaseapp.com",
    databaseURL: "https://terasherbal-7694e.firebaseio.com",
    projectId: "terasherbal-7694e",
    storageBucket: "terasherbal-7694e.appspot.com",
    messagingSenderId: "303502211142"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    RegisterPage,
    UploadPage,
    OrderPage,
    CartPage,
    ProfilePage,
    ForgotpasswordPage,
    TermsandconditionsPage,
    AwaitingApprovalPage,
    OrderhistoryPage,
    OrderdetailsPage,
    CardpaymentPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    RegisterPage,
    UploadPage,
    OrderPage,
    CartPage,
    ProfilePage,
    ForgotpasswordPage,
    TermsandconditionsPage,
    AwaitingApprovalPage,
    OrderhistoryPage,
    OrderdetailsPage,
    CardpaymentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserserviceProvider,
    FileTransfer,
    FileTransferObject,
    FileChooser,
    IOSFilePicker,
    Camera,
    Base64,
    File,
    FilePath,
    InAppBrowser
  ]
})
export class AppModule {}
