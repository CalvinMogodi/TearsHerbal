import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserserviceProvider } from '../../providers/userservice/userservice';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import * as firebase from 'firebase';

declare var Stripe;
declare var TCO;
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
    stripe = Stripe('pk_test_veYkJjz0E8rmtTE3VItKfUZP');
    tco = TCO.loadPubKey('sandbox');
    card: any;
    checkoutCard = 
    {
        sellerId: '#203740556',
        publishableKey: "B4CF6C85-9675-42DB-9B2A-FF8A1C37A46F",
        ccNo: '',
        cvv: '',
        expMonth: '',
        expYear: ''
    };
    
    deliveryMethods = 
    [
        "Collect at the shop",
        "Deliver to address"
        
    ];
    
    paymentMethods = 
    [
        "Deposit",
        "Card"
    ];
    
    public order = {
        createdDate: '',
        deliveryMethod: '',
        deliveryAddress: '',
        paymentMethod: '',
        quantity: 1,
        status: 'Pending Payment',
        userId: '',
        monthId: new Date().getMonth()+1,
        uploadedPOP: false,
        user: '',
        reference: ''
    }
    
     public database: any;
     public stock: any;
     public showSpinner: any;
     public showAddress = false;
     public showPaymentForm = false;
     public priceTotal = 0;
     public data: any
     public userId: any;
     public user: any;
     public unitsBoughtThisMonth = 0;

  constructor(private storage: Storage,public navCtrl: NavController, 
                public navParams: NavParams, public http: Http,
                public userService: UserserviceProvider, public toast: ToastController) {
      this.order.userId = navParams.get('userData5');
      this.userId = navParams.get('userData5');
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
        
        var startSearchString = '1-';
        startSearchString = startSearchString + today.getMonth()+1 + '-';
        startSearchString = startSearchString + today.getFullYear();
        
        var endSearchString = "31-";
        endSearchString = endSearchString + today.getMonth()+1 + '-';
        endSearchString = endSearchString + today.getFullYear();
        
        this.database.ref().child('orders').orderByChild('monthId')
        .equalTo(today.getMonth()+1).once('value', (snapshot)=>
        {
            snapshot.forEach(snap =>
            {
                var order = snap.val()
                if(order.userId == this.userId 
                   && order.createdDate.substring(4, order.createdDate.length-1))
                   {
                       this.unitsBoughtThisMonth += Number(order.quantity);
                   }
            });
            
            if(this.unitsBoughtThisMonth >= 5)
                    this.paymentMethods.push("Points");
                    
                    
        });
        
         this.database.ref().child('users/' + this.userId).once('value', (snapshot)=>{
                          this.user = snapshot.val();
         });
        
        //get orders placed this month
        /*this.database.ref('orders').orderByChild('createdDate')
                     .startAt(startSearchString).endAt(endSearchString)
                     .once('value', (snapshot)=>
                     {
                        snapshot.forEach(snap =>
                        {
                            var test = snap.val()
                            //this.unitsBoughtThisMonth += snap.val().quantity;
                        });
                    });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
    this.setupStripe();
  }
  
  requestToken()
  {
      /*var args = {
      sellerId: "203740556",
      publishableKey: "B4CF6C85-9675-42DB-9B2A-FF8A1C37A46F",
      ccNo: $("#ccNo").val(),
      cvv: $("#cvv").val(),
      expMonth: $("#expMonth").val(),
      expYear: $("#expYear").val()
    };*/
    
   // this.tco.requestToken()
  }
  
  success(data)
  {
      
  }
  
  failure(error)
  {
      
  }
  
  checkoutSetup()
  {
    var form = document.getElementById('myCCForm');
    form.addEventListener('submit', event => {
      event.preventDefault();
      
      this.checkoutCard = 
    {
        sellerId: '901381908',
        publishableKey: "B4CF6C85-9675-42DB-9B2A-FF8A1C37A46F",
        ccNo: '4790125006250469',
        cvv: '099',
        expMonth: '11',
        expYear: '20'
    };
      TCO.requestToken(this.success, this.failure, {
        sellerId: '901381908',
        publishableKey: 'E2D03A82-AAF0-4ED9-A82E-34D85AEE1099',
        ccNo: '4000000000000002',
        cvv: '123',
        expMonth: '11',
        expYear: '20'
    });
 
      /*this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
          
          this.data = result;
          
        }
      });*/
    });
  }
  
  setupStripe()
  {
      let elements = this.stripe.elements();
      var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    
    this.card = elements.create('card', {style: style});
    this.card.mount("#card-element");
    
    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
 
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      
       if(this.order.quantity < this.stock)
       {
           var text = "";
            var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
            var len = 5;

            for( var i=0; i < len; i++ )
                text += charset.charAt(Math.floor(Math.random() * charset.length));
                
            this.order.reference = text;
            
           var newOrder =  this.database.ref('orders').push();
            newOrder.set(this.order, done=>{
                 //update count
                 var newStock = this.database.ref('avaliableStock')
                    .set(this.stock - Number(this.order.quantity), done2=>{
                        //update points
                        this.database.ref().child('users/' + this.userId).once('value', (snapshot)=>{
                          this.user = snapshot.val();
                          
                          this.user.points = this.user.points + (30 * this.order.quantity);
                          this.database.ref().child('users/' + this.userId)
                          .update(this.user);
                          
                      });
                      this.stripe.createToken(this.card).then(result => {
                        if (result.error) {
                          var errorElement = document.getElementById('card-errors');
                          errorElement.textContent = result.error.message;
                        } else 
                        {
                          console.log(result);

                          this.data = result;
                          //go to api with result.token.id
                          this.http.get('http://localhost/api/charge').map(res => res.json())
                                            .subscribe(data=>{

                                            });
                        }
                  });
                      
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
      // this.stripe.createToken(this.card)
      
    });
  }
  

  
  checkValue(deliveryMethod)
  {
    if(deliveryMethod == "Deliver to address")
        this.showAddress = true;
    else
        this.showAddress = false;
        
  }
  
  calculateTotal(quantity)
  {
      this.priceTotal = quantity * 450;
  }
  
  placeOrder()
  {
      this.showSpinner = true;
      this.storage.set("id4", this.order);
      if (this.order.paymentMethod == 'Deposit')
      {
        if(this.order.quantity < this.stock)
        {
            //generate reference
            var text = "";
            var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
            var len = 5;

            for( var i=0; i < len; i++ )
                text += charset.charAt(Math.floor(Math.random() * charset.length));
                
            this.order.reference = text;

            var newOrder =  this.database.ref('orders').push();
            this.order.user = this.user.name + " " + this.user.surname;
            newOrder.set(this.order, done=>{
                 //update count
                 var newStock = this.database.ref('avaliableStock')
                    .set(this.stock - Number(this.order.quantity), done2=>{
                        //update points
                        this.database.ref().child('users/' + this.userId).once('value', (snapshot)=>{
                          this.user = snapshot.val();
                          
                          this.user.points = this.user.points + (30 * this.order.quantity);
                          this.database.ref().child('users/' + this.userId)
                          .update(this.user);
                          
                      });
                      
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
      else if(this.order.paymentMethod == 'Card')
      {
          this.showPaymentForm = true;
          //this.setupStripe();
      }
      else if(this.order.paymentMethod == 'Points')
      {
          
          if(this.order.quantity < this.stock)
          {
              this.database.ref().child('users/' + this.userId)
              .once('value', (snapshot)=>
              {
                  var userToProcess = snapshot.val();
                  if(userToProcess.points >= 450*Number(this.order.quantity))
                  {
                    var text = "";
                    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
                    var len = 5;

                    for( var i=0; i < len; i++ )
                        text += charset.charAt(Math.floor(Math.random() * charset.length));

                    this.order.reference = text;
                      //proceed with payment
                    var newOrder =  this.database.ref('orders').push();
                    newOrder.set(this.order, done=>{
                 //update count
                    var newStock = this.database.ref('avaliableStock')
                       .set(this.stock - Number(this.order.quantity), done2=>{
                           //update points
                           this.database.ref().child('users/' + this.userId).once('value', (snapshot)=>{
                             this.user = snapshot.val();

                             this.user.points = this.user.points - 450*Number(this.order.quantity);
                             this.database.ref().child('users/' + this.userId)
                             .update(this.user);

                         });

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
                  else
                  {
                      //not enough points
                       let toast = this.toast.create({
                               message: 'You do not haven enough points.\n\
                                        Please select a different method.',
                               duration: 3000,
                               position: 'top'
                             });
                          
                        toast.present();
                        this.showSpinner = false;
                  }
              });
          }
      }
      
  }

}
