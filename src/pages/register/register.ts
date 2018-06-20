import { LoginPage } from '../login/login';
import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as firebase from 'firebase'

@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
    providers: [UserserviceProvider]
})
export class RegisterPage {
    signUpFirstForm: FormGroup;
    signUpSecondForm: FormGroup;
    submitAttempt: boolean = false;
    secondSubmitAttempt: boolean = false;
    showError: boolean = false;
    message: string;
    database: any;
    referredBy: any;
    peoples = [];

    public account = {
        name: '',
        surname: '',
        cellPhone: '',
        email: '',
        password: '',
        confirmPassword: '',
        referredBy: '',
        referredByUser: '',
        address: '',
        accountNumber: '',
        profilePicture: '',
        IDNumber: '',
        bankName: '',
        userType:'User',
        isActive: false,
        points: 0,
        displayName: '',
        uploadedIDNumberPassport: false
    }
    selectImagePath = 'assets/imgs/ic_person_black.png';
    public step = 1;
    constructor(private menuCtrl: MenuController, public userService: UserserviceProvider, public navCtrl: NavController, public formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
            this.menuCtrl.enable(false);
            this.signUpFirstForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])],
            surname: ['', Validators.compose([Validators.required])],
            cellPhone: ['', Validators.compose([Validators.required])],
            confirmPassword: ['', Validators.compose([Validators.required])],
        });

        this.signUpSecondForm = formBuilder.group({
            referredBy: ['', Validators.compose([Validators.required])],
            address: ['', Validators.compose([Validators.required])],
            accountNumber: ['', Validators.compose([Validators.required])],
            IDNumber: ['', Validators.compose([Validators.required])],
            bankName: ['', Validators.compose([Validators.required])],
        });
    }

    next() {
        this.submitAttempt = true;
        if (this.signUpFirstForm.valid) {
            this.step = 2;
        }
    }

    back() {
        this.step = 1;
    }

    addFocus(){
var s = 0;
    }
    search(){
        let txt = this.referredBy.trim();
        if(txt.length > 2){
             let usersRef = firebase.database().ref('users');
           usersRef.orderByValue().startAt(txt).limitToFirst(5).once('value', snapshot => {
               var dsd = 0;
               this.peoples = [];
                snapshot.forEach(snap=>
                {
                    var item = snap.val();
                    item.key = snap.key;
                    this.peoples.push(item);
                    return false;
                });
            });
        }
    }

    removeFocus(){
var s = 0;
    }
    
    addNote(item){
        this.referredBy = item.name + ' ' + item.surname + ' - ' + item.IDNumber;
        this.account.referredByUser = item.name + ' ' + item.surname;
        this.account.referredBy = item.key;
        this.peoples = [];
    }
    signUp() {
          this.showError = false;
         this.message = '';
        this.secondSubmitAttempt = true;
        if(true){
        //if (this.signUpSecondForm.valid) {
            var loader = this.loadingCtrl.create({
                content: "Please wait..."
            });

            loader.present();
            this.account.displayName = this.account.name + ' ' + this.account.surname;
            this.userService.signUpUser(this.account).then(authData => {
                loader.dismiss();
                let toast = this.toastCtrl.create({
                    message: 'You have signed up successful.',
                    duration: 2000,
                    position: 'bottom'
                });
                toast.present(toast);
                this.navCtrl.setRoot(LoginPage);
            }, error => {
                loader.dismiss();
                this.showError = true;
                this.message = error;
            })

        }
    }
}
