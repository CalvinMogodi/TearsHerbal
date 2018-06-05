import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase'
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  id: any;

  pages: Array<{title: string, component: any}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, 
      public splashScreen: SplashScreen, public events: Events) {
      events.subscribe("gotId", (uid)=>{
          this.id = uid;
      });
    this.initializeApp();
    var that = this;
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        that.rootPage = LoginPage;
      }
      else{
        that.rootPage = LoginPage;
      }
    })
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Log Out', component: LoginPage },
      { title: 'Home', component: HomePage },
      { title: 'Profile', component: ProfilePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {
        profileId: this.id
    });
  }
}
