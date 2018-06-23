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
  public loading = true;
  public loadingPrice = true;
  public loadingStock = true;
  public price = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public storage: Storage) {
    this.uid = navParams.get('userData2');

    this.database = firebase.database();

    //get number of stock available
    var refForAvailableStock = this.database.ref();
    refForAvailableStock.child('manufactureData/avaliableStock').on('value', (snapshot) => {
      var availableStock = snapshot.val();
      if(availableStock == null || availableStock == undefined)
        this.availableStock = 0;
        else
          this.availableStock = availableStock;
      this.loadingStock = false;
      if(!this.loadingPrice)
        this.loading = false;
    });

    let priceRef = firebase.database().ref('staticData/saPrice');
    priceRef.orderByValue().on("value", juicePrice => {
      var price = juicePrice.val();
      if(price == null || price == undefined)
        this.price = 0;
        else
        this.price = price;
      
      this.loadingPrice = false;
      if(!this.loadingStock)
        this.loading = false;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }
 

  goToCart() {
    // this.storage.set("id7", this.uid);
    let modal = this.modalCtrl.create(CartPage,
      {
        userData5: this.uid,
        price: this.price, 
        availableStock: this.availableStock,
      });
    modal.present();
  }

}
