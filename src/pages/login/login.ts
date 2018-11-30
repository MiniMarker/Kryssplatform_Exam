import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private user = {
    username: "",
    password: ""
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore) {
  }

  /**
   * Uses AngularFirestore Authentication to log in with email and password given in
   * the input fields
   */
  public logInUser(): void{
    this.af.app.auth()
      .signInWithEmailAndPassword(this.user.username, this.user.password)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  /*
      Navigation
   */
  public goToMainPage(): void{
    this.navCtrl.push('MainPage', {});
  }

	public goToSignupPage(): void{
		this.navCtrl.push('SignupPage', {});
	}

}
