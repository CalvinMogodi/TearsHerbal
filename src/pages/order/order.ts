import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
    public uid: any;
    public database: any;
    public availableStock: any;
    public showButton = false
    public loading = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, public storage: Storage) {
              this.uid = navParams.get('userData2');
              
               this.database = firebase.database();
               
              //get number of stock available
               var refForAvailableStock = this.database.ref();
               refForAvailableStock.child('avaliableStock').on('value', (snapshot)=>
               {
                   this.availableStock = snapshot.val();
                   this.showButton = true;
               });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }
  
  goToCart()
  {
     // this.storage.set("id7", this.uid);
    let modal = this.modalCtrl.create(CartPage, 
    {
        userData5: this.uid,
    });
    modal.present();
  }

}
