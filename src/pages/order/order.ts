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
    public historicOrders = [];
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
               
            //get historic data
            var refForHistoricData = this.database.ref();
            refForHistoricData.child('orders').orderByChild('userId').equalTo(this.uid).on('value', (snapshot)=>{
        //this.database.ref('orders').orderByValue().once('value', (snapshot) =>{

           var test = snapshot.val();
           if(test != null)
           {
              this.storage.set("id2", test);
              let t = [];
              snapshot.forEach(snap =>{
                  this.historicOrders.push(snap.val());

              });
              
              this.loading = false;
           }
           else
           {
                this.loading = false;
           }

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
