import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { UploadPage } from '../upload/upload';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
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
  public fireAuth: any;
  public database: any;
  constructor(private storage: Storage, public userService: UserserviceProvider, public navCtrl: NavController, public formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });

    this.fireAuth = firebase.auth();
    this.database = firebase.database();
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
        //get data from db
        var userId = this.database.ref().child('users').orderByChild('email').equalTo(this.user.email).once('value', (snapshot) =>{
            //return snapshot.val() || 'Anoynymous';
            var test = snapshot.val();
            this.storage.set("id", test.isActive);

            loader.dismiss();
            this.navCtrl.setRoot(HomePage);

        });

      }, error => {
        loader.dismiss();
        this.showError = true;
      });
    }
  }

}
