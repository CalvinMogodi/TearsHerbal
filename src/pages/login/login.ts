import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }
  
  public goToSignUp() {
  this.navCtrl.push(HomePage);
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
