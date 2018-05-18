import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as firebase from 'firebase'

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
    deliveryMethods = 
    [
        "Collect at the shop",
        "Deliver to address"
        
    ];
    
    paymentMethods = 
    [
        "Deposit",
    ];
    
    public order = {
        createdDate: '',
        deliveryMethod: '',
        paymentMethod: '',
        quantity: '',
        status: 'Pending Payment',
        userId: ''
    }
    
     public database: any;
     public stock: any;

  constructor(private storage: Storage,public navCtrl: NavController, public navParams: NavParams,
                public userService: UserserviceProvider, public toast: ToastController) {
      this.order.userId = navParams.get('userData5');
      //this.stock = navParams.get('stock');
      this.database = firebase.database();
      
      //get number of stock available
        this.database.ref().child('avaliableStock').on('value', (snapshot)=>
        {
            this.stock = snapshot.val();
        });
      
      var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        var date = dd + '-' + mm + '-' + yyyy;
        
        this.order.createdDate = date;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }
  
  placeOrder()
  {
      this.storage.set("id4", this.order);
     
      if(this.order.quantity < this.stock)
      {
            var newOrder =  this.database.ref('orders').push();
            newOrder.set(this.order, done=>{
                 //update count
                 var newStock = this.database.ref('avaliableStock')
                    .set(this.stock - Number(this.order.quantity), done2=>{
                        let toast = this.toast.create({
                            message: 'Order placed successfuly',
                            duration: 3000,
                            position: 'top'
                          });
                          
                        toast.onDidDismiss(() => {
                            this.navCtrl.setRoot(HomePage, {userData: this.order.userId})
                          });
                          
                        toast.present();
                    });
            });
            
           
      }
  }

}
