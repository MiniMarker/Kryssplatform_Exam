import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireStorageModule} from "angularfire2/storage";

import GoogleFirebaseApiKey from './GoogleFirebaseApiKey';
import { MyApp } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { Camera } from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {TabsPage} from "../pages/tabs/tabs";
import {MainPage} from "../pages/main/main";
import {ProfilePage} from "../pages/profile/profile";
import {AddBookPage} from "../pages/add-book/add-book";
import { MapsProvider } from '../providers/maps/maps';
import {Toast} from "@ionic-native/toast";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import { BookInfoProvider } from '../providers/bookInfo/bookInfo';
import {HTTP} from "@ionic-native/http";
import {LaunchNavigator} from "@ionic-native/launch-navigator";
import {AngularFireDatabase} from "angularfire2/database";
import {PipesModule} from "../pipes/pipes.module";
import {MessagesPage} from "../pages/messages/messages";

@NgModule({
	declarations: [
		MyApp,
    TabsPage,
    MainPage,
    ProfilePage,
    AddBookPage,
    MessagesPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(GoogleFirebaseApiKey),
		AngularFirestoreModule,
		AngularFireAuthModule,
		HttpClientModule,
		AngularFireStorageModule,
    PipesModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
    TabsPage,
    MainPage,
    ProfilePage,
    AddBookPage,
    MessagesPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		Camera,
    MapsProvider,
    Geolocation,
    Toast,
    BarcodeScanner,
    BookInfoProvider,
    HTTP,
    LaunchNavigator,
    AngularFireDatabase
	]
})
export class AppModule {
}
