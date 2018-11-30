import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Book} from "../../models/Book";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {LaunchNavigator} from '@ionic-native/launch-navigator';
import {Geolocation} from "@ionic-native/geolocation";
import {PurchasePage} from "../purchase/purchase";
import {SendMessagePage} from "../send-message/send-message";

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-book-details',
  templateUrl: 'book-details.html',
})
export class BookDetailsPage {

  //get the div
  @ViewChild('map') mapRef: ElementRef;

  private map: any;
  private book: Book;
  private postCollection: AngularFirestoreCollection<Book>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private launchNavigator: LaunchNavigator,
              private af: AngularFirestore,
              private geolocation: Geolocation) {

    //getNavParams
    this.book = navParams.get('book');
    this.postCollection = navParams.get('postCollection');
  }

  /**
   * Update the field "pageVisits" for the book passed as navParam
   * add 1 to the value in the database
   */
  private updatePageVisits(): void {
    this.postCollection.doc(this.book.id).update({
      pageVisits: this.book.pageVisits + 1
    });
  }

  /**
   * Using Google Maps to generate a map inside the div with id="map" on the HTML-page
   * The center of the map and the mark will be on the coordinated the book was created at.
   */
  private showMap(): void {

    //set location details
    const location = new google.maps.LatLng(this.book.location[0], this.book.location[1]);

    //set map options
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true

    };

    //create a map given the div tag in HTML, the location details and map options
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    //add a marker on the map
    new google.maps.Marker({
      position: {
        lat: this.book.location[0],
        lng: this.book.location[1]
      },
      map: this.map
    });
  }

  /**
   * Use Ionic Native's Geolocation Plugin to locate the users current position
   * This data is passed to Ionic Native's LaunchNavigator Plugin that redirects the user to
   * the Google Maps app where it shows routes to the coordinates for the book.
   */
  public openMapInMaps():void {

    //Get current user position
    this.geolocation.getCurrentPosition().then((res) => {

      //pass the books- and the users location to Google Maps
      this.launchNavigator.navigate([this.book.location[0], this.book.location[1]], {
        start: [res.coords.latitude, res.coords.longitude],
        app: this.launchNavigator.APP.GOOGLE_MAPS
      });
    });
  }

  /**
   * Check if the book is owned by the logged in user
   * @returns {boolean} true if logged in user is the owner of the book
   */
  public isBookOwedBySignedInUser():boolean{
    return this.book.userUid == this.af.app.auth().currentUser.uid
  }

  /*
      Navigation
   */
  public goToPurchasePage():void{
    this.navCtrl.push('PurchasePage', {});
  }

  public goToSendMessagePage(book: Book):void{
    this.navCtrl.push('SendMessagePage', {
      //send params
      book
    });
  }


  /*
      Lifecycle
   */
  public ionViewDidLoad(): void {
    this.updatePageVisits();
    this.showMap();
  }
}
