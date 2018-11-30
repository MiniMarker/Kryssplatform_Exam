import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Book} from "../../models/Book";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Chat} from "../../models/Chat";
import {BookDetailsPage} from "../book-details/book-details";
import {Toast} from "@ionic-native/toast";
import {DateFormatter} from "@angular/common/src/pipes/deprecated/intl";

@IonicPage()
@Component({
  selector: 'page-send-message',
  templateUrl: 'send-message.html',
})
export class SendMessagePage {

  private chatCollection: AngularFirestoreCollection<Chat>;
  private book: Book;
  private messageText: string = "";
  private message: {
    message: string,
    date: number,
    read: false
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private toast: Toast) {

    //get navparams
    this.book = this.navParams.get('book');
    this.chatCollection = this.af.collection<Chat>("chats")

  }

  public sendMessage(): void {

    let currentTime = new Date();
    let currentTimeString = `${currentTime.getHours()}:${currentTime.getMinutes()}`;

    this.chatCollection.add({
      senderUid: this.af.app.auth().currentUser.uid,
      senderName: this.af.app.auth().currentUser.displayName,
      senderImg: this.af.app.auth().currentUser.photoURL,
      reciverUid: this.book.userUid,
      reciverName: this.book.user,
      reciverImg: this.book.profilePictureUrl,
      bookImgSrc: this.book.imgSrc,
      bookTitle: this.book.title,
      latestMessageTimeStamp: Date.now(),
      latestMessageTime: currentTimeString,
      messages: [{
        sender: this.af.app.auth().currentUser.displayName,
        message: this.messageText,
        read: false,
        timestamp: Date.now(),
        time: currentTimeString
      }]
    } as Chat);

    //success tasks
    this.toast.showShortBottom(`Message sent to ${this.book.user}`).subscribe();
    this.goToBookDetailPage(this.book);
  }


  /*
      Navigation
   */
  public goToBookDetailPage(book: Book): void {
    this.navCtrl.push('BookDetailsPage', {
      book
    });
  }
}
