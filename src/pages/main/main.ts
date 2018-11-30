import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Book} from "../../models/Book";
import {Observable} from "rxjs/Observable";
import {BookDetailsPage} from "../book-details/book-details";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  private collection: AngularFirestoreCollection<Book>;
  public posts: Observable<Book[]>;
  private filterableArray: Array<Book> = [];
  private currentItemsArray: Array<Book> = [];


  private priceFilter = 0;
  private categoryFilter: string = "";
  private titleFilter: any = "";
  private showFilterOption: boolean = false;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private barcodeScanner: BarcodeScanner) {

    //Getting all posts in 'posts' bookCollection on Firebase
    this.collection = af.collection<Book>("posts", (ref) => {

      //Running a query to sort by 'date' desc
      return ref.orderBy('date', 'desc');

    });

    this.posts = this.collection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Book;
          let id = action.payload.doc.id;

          return {
            id, ...data
          };
        });
      });

    //getting data for the filterable arrays
    this.posts.subscribe(res => {
      this.filterableArray = res as Book[];
      this.currentItemsArray = res as Book[];
    });
  }

  /**
   * Filter items by using the rangebar to adjust price
   */
  public filterItemsByPrice():void {
    this.currentItemsArray = this.filterableArray.filter((item) => {

      return (item.price >= this.priceFilter);

    });
  }

  /**
   * Filters the array of books to only show those who match the users input
   */
  public filterBooksByTitle():void {
    this.currentItemsArray = this.filterableArray.filter((item) => {

      return (item.title.toLowerCase().indexOf(this.titleFilter.toLowerCase()) > -1);

    });
  }

  /**
   * Launces the barcodescanner module to capture the ISBN number of the book.
   * Returns it as a string and filters the array of books.
   */
  public filterBooksByIsbn():void {

    this.barcodeScanner.scan({
      disableSuccessBeep: false,
      showTorchButton: true
    })
      .then(data => {

        this.titleFilter = data.text;

        this.currentItemsArray = this.filterableArray.filter((item) => {
          return item.isbn == +data.text;
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  /**
   * Filters the list of books based on category
   */
  public filterBooksByCategory():void {
    this.currentItemsArray = this.filterableArray.filter((item) => {

      return (item.category.toLowerCase().indexOf(this.categoryFilter.toLowerCase()) > -1);

    });
  }

  /**
   * Resets the filters
   */
  public resetFilter(): void {
    this.categoryFilter = "";
    this.priceFilter = 0;
    this.titleFilter = "";

    this.currentItemsArray = this.filterableArray;
  }

  /**
   * Shows or hides the filter menu
   */
  public showFilterOptions(): void {
    if (this.showFilterOption == false) {
      this.showFilterOption = true
    } else {
      this.showFilterOption = false
    }
  }

  /*
      Navigation
   */

  public goToBookDetails(book: Book):void {
    this.navCtrl.push("BookDetailsPage", {
      book,
      postCollection: this.collection
    });
  }

}


