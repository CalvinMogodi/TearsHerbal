import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabaseModule } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController)
  {

  }

}
