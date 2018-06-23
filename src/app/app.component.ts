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
  userId: any;
  public database: any;
  pages: Array<{title: string, component: any, icon: string, isActive: boolean}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events) {
      events.subscribe("gotId", (uid)=>{
          this.id = uid;

      });
    this.initializeApp();  
    
    var that = this;
    this.database = firebase.database();
    firebase.auth().onAuthStateChanged( user => {
      if(user){          
          this.userId = user.uid;
          this.database.ref().child('users/' + user.uid).once('value', (snapshot)=>{
            var user = snapshot.val();
            if(user.uploadedProfileImage){
              let storageRef = firebase.storage().ref();
              var starsRef = storageRef.child('profileImages' + user.uid);        
              starsRef.getDownloadURL().then( url => {
                    this.profilePicURL = url;
                });
            }
          });       
      }
      else{
        that.rootPage = LoginPage;
        this.nav.setRoot(LoginPage);
      }
    })
    that.rootPage = LoginPage;
    // used for an example of ngFor and navigation
    this.pages = [     
      { title: 'Home', component: HomePage, icon: 'home', isActive: false },
      { title: 'Profile', component: ProfilePage, icon: 'person', isActive: true },
      { title: 'Log Out', component: LoginPage, icon: 'lock', isActive: false },
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
    if(page.title == 'Profile')
    {
      this.nav.push(page.component, {
        profileId: this.userId
      });
    }else{
      if(page.title == 'Log Out'){
          firebase.auth().signOut();
      }
      this.nav.setRoot(page.component, {
          userData: this.userId
      });
    }
    
  }
}
