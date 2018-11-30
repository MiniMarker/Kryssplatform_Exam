import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {Camera} from "@ionic-native/camera";
import {MapsProvider} from "../../providers/maps/maps";
import {Geolocation} from "@ionic-native/geolocation";
import {AngularFireStorage} from "angularfire2/storage";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Book} from "../../models/Book";
import {Observable} from "rxjs/Observable";
import {Toast} from "@ionic-native/toast";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {BookInfoProvider} from "../../providers/bookInfo/bookInfo";

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {


  private collection: AngularFirestoreCollection<Book>;
  private posts: Observable<Book[]>;

  private loading: any = null;
  private addInfoFields = false;
  private previewImg: string = "";

  private book: {
    isbn: number,
    title: string,
    author: string,
    description: string,
    price: number,
    condition: string,
    category: string
  } = {
    isbn: null,
    title: "",
    author: "",
    description: "",
    price: null,
    condition: null,
    category: ""
  };

  private location: {
    lat: number,
    lng: number,
    formatted_name: string,
    zipCode: number,
    city: string
  } = {
    lat: 0,
    lng: 0,
    formatted_name: "",
    zipCode: null,
    city: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private geolocation: Geolocation,
    private maps: MapsProvider,
    private af: AngularFirestore,
    private afStorage: AngularFireStorage,
    private toast: Toast,
    private barcodeScanner: BarcodeScanner,
    private bookInfoProvider: BookInfoProvider,
    private actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {

    this.collection = af.collection<Book>("posts");
  }

  /**
   * Uploads the base64 string in previewImg to AngularFireStorage with template name:
   *    '<logged in users email>_<Date().getTime()>.png'
   *
   * Inserts the Book-Object to AngularFirestoreCollection<Book> with the user-entered data.
   * Shows a confirmation toast
   * Clears all input fields
   */
  public addPost(): void {

    if (this.book.title.length > 0 || this.book.author.length > 0 || this.book.description.length > 0
      || this.book.category.length > 0 || this.location.formatted_name.length > 0 || this.book.price > 0
      || this.book.condition.length > 0 || this.previewImg.length > 0) {

      this.showLoadingScreen();

      //name the photo file
      let imgFileName: string = `${this.af.app.auth().currentUser.email}_${new Date().getTime()}.png`;

      this.afStorage.ref(imgFileName)
        .putString(this.previewImg, 'base64', {
          contentType: 'image/png'
        }).downloadURL().subscribe((uploadImgUrl) => {

        //add the bookinfo to database
        this.collection.add({
          isbn: this.book.isbn,
          title: this.book.title,
          author: this.book.author,
          desc: this.book.description,
          price: (this.book.price),
          date: Date.now(),
          imgSrc: uploadImgUrl,
          condition: this.book.condition,
          category: this.book.category,
          location: [
            this.location.lat,
            this.location.lng,
            this.location.formatted_name
          ],
          pageVisits: 0,
          user: this.af.app.auth().currentUser.displayName,
          userUid: this.af.app.auth().currentUser.uid,
          profilePictureUrl: this.af.app.auth().currentUser.photoURL,
        } as Book);

        //show toast
        this.toast.showShortBottom(`${this.book.title} added to database`).subscribe();

        //finishing actions
        this.resetText();
        this.loading.dismiss();
        this.goToMainPage()
      });
    }
  }


  /**
   * Resets all text fields
   */
  private resetText(): void {
    this.book.isbn = null;
    this.book.title = "";
    this.book.author = "";
    this.book.description = "";
    this.book.price = null;
    this.book.condition = null;
    this.book.category = null;
    this.previewImg = "";
    this.location.lat = 0;
    this.location.lng = 0;
    this.location.formatted_name = "";
    this.addInfoFields = false;
  };

  /**
   * Use Ionic Native's Camera Plugin to take a picture with given options:
   *    Back camera
   *    JPEG encoding
   *    Base64
   *    Correct Orientation
   */
  public executeCamera(): void {

    //Launch camera
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL, //Use Base64
      encodingType: this.camera.EncodingType.JPEG, //Use JPEG as encoding
      cameraDirection: this.camera.Direction.BACK, //Use front camera
      correctOrientation: true //User correct orentation
    }).then(
      imgBase64 => {
        this.previewImg = imgBase64;
      })
      .catch(err => {
        console.log(err);
      })
  }

  /**
   * Use Ionic Native's Camera Plugin to select a picture form the local photo library with given options:
   *    Base64
   *    JPEG encoding
   *    Correct Orientation
   */
  public choosePicture(): void {

    //Launch photo library
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, //Use photolibrary
      destinationType: this.camera.DestinationType.DATA_URL, //Use Base64
      encodingType: this.camera.EncodingType.JPEG, //Use JPEG as encoding
      correctOrientation: true //User correct orentation
    }).then(
      imgBase64 => {
        this.previewImg = imgBase64;
      })
      .catch(err => {
        console.log(err);
      })
  }

  /**
   * Use Ionic Native's Barcode Scanner Plugin to read the bookInfo of the books ISBN-code
   * This data is passed to the BookInfoProviders getBookDataFromIsbn() method
   * The provider returns a Observable JSON-Object that I use to get the books information
   */
  public executeBarcodeScanner(): void {

    let authors: string = "";

    //Launch bookInfo scanner
    this.barcodeScanner.scan({
      disableSuccessBeep: false,
      showTorchButton: true
    })
      .then(data => {

        //If the user cancels the barcode scan
        if (data.cancelled) {
          this.toast.showShortBottom("Scanning avbrutt").subscribe();
          return null;
        }

        this.toast.showShortBottom(`${data.text} registert`);

        //Enter the bookInfo-number to ISBN-API
        this.bookInfoProvider.getBookDataFromIsbn(data.text)
          .subscribe((res: any) => {

            this.book.isbn = +data.text;
            this.book.title = res.items[0].volumeInfo.title; // Set book title
            this.book.description = res.items[0].volumeInfo.description; //Set book description

            //The book can have more than one author so i need to iterate through the array in the API
            //and insert with/without comma as separator
            for (let i = 0; i < res.items[0].volumeInfo.authors.length; i++) {

              if (i == res.items[0].volumeInfo.authors.length - 1) {
                authors += res.items[0].volumeInfo.authors[i];
              } else {
                authors += res.items[0].volumeInfo.authors[i] + ", "
              }
            }

            this.book.author = authors;

          });

        this.addInfoFields = true;

      })
      .catch((err) => {

        console.log(err);
        this.toast.showShortBottom("Vennligst prøv igjen...").subscribe();
      })
  }

  /**
   * Show loading icon
   */
  private showLoadingScreen(): void {
    this.loading = this.loadingCtrl.create({
      content: "Vent litt..."
    });

    this.loading.present();

  }

  /**
   * Show actionsheet to let the user decide how they want to add data
   */
  public showInfoActionSheet(): void {
    this.actionSheetCtrl.create({
      enableBackdropDismiss: false,
      title: "Hvordan vil du legge til data?",
      buttons: [
        {
          text: "Skann strekkode",
          handler: () => {
            this.executeBarcodeScanner();
          }
        }, {
          text: "Legg til manuelt",
          handler: () => {
            this.addInfoFields = true;
          }
        }, {
          text: "Avbryt",
          role: "cancel"
        }
      ]
    }).present()
  };

  /**
   * Shows a actionsheet for the user to choose if they want to use the current location
   */
  public showLocationActionSheet(): void {
    this.actionSheetCtrl.create({
      enableBackdropDismiss: false,
      title: "Din nåværende lokasjon vil bli puslisert i annonsen",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.executeLocation();
          }
        }, {
          text: "Avbryt",
          role: "cancel"
        }
      ]
    }).present()
  }

  /**
   * Use Ionic Native's Geolocation Plugin to receive the phones coordinates
   * This data is saved to the database and passed to the MapsProviders getLocation() method
   * The provider returns a Observable JSON-Object that I use to get the formatted_address field
   */
  private executeLocation(): void {
    this.geolocation.getCurrentPosition().then((res) => {

      //Set coordinated
      this.location.lat = res.coords.latitude;
      this.location.lng = res.coords.longitude;

      this.maps.getLocation(this.location.lat, this.location.lng)
        .subscribe((res: any) => {
          console.log(res);
          this.location.formatted_name = res.results[1].formatted_address; //Set formatted address text
          this.location.city = res.results[0].address_components[3].long_name;
        });

    }).catch((err) => {
      console.log("Error getting location", err);
    });
  }

  /*
      Navigation
   */
  public goToMainPage(): void {
    this.navCtrl.push('MainPage', {});
  }


  /*
      Lifecycle
   */
  ionViewDidLeave() {
    this.resetText();
  }

}
