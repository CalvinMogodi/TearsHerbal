import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import * as firebase from 'firebase'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserserviceProvider } from '../providers/userservice/userservice';

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
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserserviceProvider
  ]
})
export class AppModule {}
