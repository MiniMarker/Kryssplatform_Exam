import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import { AngularFirestore } from "angularfire2/firestore";
import { TabsPage } from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              af: AngularFirestore) {

    //Lazy loading the HomePage if there is a logged in user
    af.app.auth().onAuthStateChanged(
      (loggedInUser) => {
        if (loggedInUser) {
          this.rootPage = TabsPage
        } else {
          this.rootPage = 'HomePage'
        }
      }
    );


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

