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
  profilePicURL = 'assets/imgs/profile.png';
  rootPage: any = LoginPage;
  public displayname = 'Name Surname';
  id: any;
  pages: Array<{title: string, component: any, icon: string}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, 
      public splashScreen: SplashScreen, public events: Events) {
      events.subscribe("gotId", (uid)=>{
          this.id = uid;
      });
    this.initializeApp();  

    var that = this;
    firebase.auth().onAuthStateChanged( user => {
      if(user){
          let storageRef = firebase.storage().ref();
         var starsRef = storageRef.child('profileImages/' + user.uid);        
               starsRef.getDownloadURL().then( url => {
                    this.profilePicURL = url;
                });
        that.rootPage = HomePage;
        this.nav.setRoot(HomePage, {
                    userData: user.uid
                });
      }
      else{
        that.rootPage = LoginPage;
        this.nav.setRoot(LoginPage);
      }
    })
    // used for an example of ngFor and navigation
    this.pages = [     
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Profile', component: ProfilePage, icon: 'person' },
      { title: 'Log Out', component: LoginPage, icon: 'lock'},
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

    if(page.title == 'Profile')
    {
      this.nav.push(page.component, {
        profileId: this.id
      });
    }else{
      this.nav.setRoot(page.component, {
          profileId: this.id
      });
    }
    
  }
}
