import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as firebase from 'firebase'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserserviceProvider]
})
export class LoginPage {
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  showError: boolean = false;
  public user = {
    email: '',
    password: '',
  }
  constructor(public userService: UserserviceProvider, public navCtrl: NavController, public formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  forgotPassword() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn() {
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      var loader = this.loadingCtrl.create({
        content: "Please wait..."
      });

      loader.present();

      this.userService.loginUser(this.user.email, this.user.password).then(authData => {
        loader.dismiss();
        this.navCtrl.setRoot(HomePage);
      }, error => {
        loader.dismiss();
        this.showError = true;
      });
    }
  }

}
