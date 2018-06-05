import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { OrderPage } from '../order/order';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  uid : any;
  public database: any;
  public numOfOrders: any;
  public user: any;
  public points: any;
  public usersUnderMe = [];
  public loading = true;
  
  constructor(public userService: UserserviceProvider,public navCtrl: NavController, 
                public navParams: NavParams, public storage: Storage,
                public events: Events)
  {
    this.uid = navParams.get('userData');
    this.events.publish("gotId", this.uid);
    //this.uid = this.userService.getUid();
    this.database = firebase.database();
    
    //get user
     this.database.ref().child('users/' + this.uid).once('value', (snapshot)=>{
            this.user = snapshot.val();
            this.points = this.user.points;
        });
    
    //get number of orders placed
    var refForOrders = this.database.ref();
    refForOrders.child('orders').orderByChild('userId').equalTo(this.uid).once('value', (snapshot)=>{
     //this.database.ref('orders').orderByValue().once('value', (snapshot) =>{
         
         var test = snapshot.val();
         if(test != null)
         {
            this.storage.set("id2", test);
            let t = [];
            snapshot.forEach(snap =>{
                t.push(snap.val());
            });
            this.numOfOrders = t.length;
         }
         else
            this.numOfOrders = 0;
         
     });
     
     //get people under user
     var refForUsers = this.database.ref();
     refForUsers.child('users').orderByChild('referredBy').equalTo(this.uid).once('value', (snapshot)=>{
     //this.database.ref('orders').orderByValue().once('value', (snapshot) =>{
         
        var test = snapshot.val();
        if(test != null)
        {
           this.storage.set("id2", test);
           let t = [];
           snapshot.forEach(snap =>{
               this.usersUnderMe.push(snap.val());
               
           });
           
           this.loading = false;
        }
        else
        {
            this.loading = false;
        }
         
     }); 
     
  }

  public viewOrders()
  {
    this.navCtrl.setRoot(OrderPage, {
        userData2: this.uid
    });
  }

}
