import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

/**
 * Generated class for the OrderhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderhistory',
  templateUrl: 'orderhistory.html',
})
export class OrderhistoryPage {
  public uid: any;
  public database: any;
  public historicOrders = [];
  public loading = true;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.uid = navParams.get('userData2');
    this.database = firebase.database();
    var refForHistoricData = this.database.ref();
    refForHistoricData.child('orders').orderByChild('userId').equalTo(this.uid).on('value', (snapshot)=>{
      var order = snapshot.val();
           if(order != null)
           {
             snapshot.forEach(snap =>{
                  this.historicOrders.push(snap.val());
              });;
           }
           this.loading = false;
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderhistoryPage');
  }

}
