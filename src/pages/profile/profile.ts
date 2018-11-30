import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import * as firebase from "firebase";
import {Book} from "../../models/Book";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Toast} from "@ionic-native/toast";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private userDetails = {
    name: "",
    email: "",
    profilePicture: ""
  };

  private bookCollection: AngularFirestoreCollection<Book>;
  private posts: Observable<Book[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private toast: Toast) {

    let loggedInUser = firebase.auth().currentUser;

    //get userinfo for auth
    if (loggedInUser != null) {
      this.userDetails.name = loggedInUser.displayName;
      this.userDetails.email = loggedInUser.email;
      this.userDetails.profilePicture = loggedInUser.photoURL;
    }

    //Getting all posts in 'posts' bookCollection on Firebase
    this.bookCollection = af.collection<Book>("posts", (ref) => {

      //Running a query to select the books that the authenticated user has published ordered by 'date' desc
      return ref.where('user', '==', this.userDetails.name).orderBy('date', 'desc');

    });

    this.posts = this.bookCollection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Book;
          let id = action.payload.doc.id;

          return {
            id, ...data
          };
        });
      });
  }

  /**
   * Deletes the given post from database
   * @param {Book} book book to delete
   */
  public deletePost(book: Book): void {
    this.bookCollection.doc(book.id).delete()
      .then(() => {
        this.toast.showShortBottom(`${book.title} er slettet`).subscribe();
      })
      .catch(err => {
        console.log(err);
      })
  }


  /**
   * Uses AngularFirestore Authentication to sign out the user
   */
  public signOut(): void {
    this.af.app.auth().signOut();
  }

  /*
      Navigation
   */
  public goToBookDetails(book: Book): void {
    this.navCtrl.push("BookDetailsPage", {
      book,
      postCollection: this.bookCollection
    });
  }
}
