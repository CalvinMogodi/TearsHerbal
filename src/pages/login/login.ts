import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { UploadPage } from '../upload/upload';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
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
  constructor(private storage: Storage, public userService: UserserviceProvider, 
      public navCtrl: NavController, public formBuilder: FormBuilder,
       public toastCtrl: ToastController, public loadingCtrl: LoadingController,
       public http: Http) {
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
        this.database.ref('users/' + authData.uid).once('value', (snapshot) =>{
            //return snapshot.val() || 'Anoynymous';
            var user = snapshot.val();
            this.storage.set("id", authData.uid);
            this.userService.setUid(authData.uid);
            var test = this.userService.getUid();
            
            if(user.isActive == true)
            {
                /*this.http.get('http://localhost/api/sms/send').map(res => res.json())
                            .subscribe(data=>{
                                
                            });*/
                loader.dismiss();
                this.navCtrl.setRoot(HomePage, {
                    userData: test
                });
            }
            else
            {
                 loader.dismiss();
                 this.navCtrl.setRoot(UploadPage, {
                    userData: authData.uid
                });
            }

        });

      }, error => {
        loader.dismiss();
        this.showError = true;
      });
    }
  }

}
