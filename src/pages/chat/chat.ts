import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {Chat} from "../../models/Chat";
import {Observable} from "rxjs/Observable";
import {Book} from "../../models/Book";


@IonicPage()
@Component({
  selector: 'page-respond',
  templateUrl: 'chat.html',
})
export class ChatPage {

  private chat: Chat;
  private chat2 = {} as Chat;
  private displayedChatDocument: AngularFirestoreDocument<Chat>;
  private messageText: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore) {


    //get navparams
    this.chat = this.navParams.get("chat");

    //get chat document based on navparam
    this.displayedChatDocument = af.collection<Chat>("chats").doc(this.chat.id);

    this.displayedChatDocument.valueChanges().subscribe((res) => {
      this.chat2 = res as Chat;
    })

  }

  /**
   * This message appends the new chat message to the existing array in Chat
   */
  public respondToMessage(): void {

    let currentTime = new Date();
    let currentTimeString = `${currentTime.getHours()}:${currentTime.getMinutes()}`;

    let updatedMessagesArray = this.chat2.messages.concat({
      message: this.messageText,
      sender: this.af.app.auth().currentUser.displayName,
      read: false,
      timestamp: Date.now(),
      time: currentTimeString
    });

    this.displayedChatDocument.update({
      latestMessageTimeStamp: Date.now(),
      latestMessageTime: currentTimeString,
      messages: updatedMessagesArray
    } as Chat);

    this.messageText = "";

  }

  /**
   * Checks if logged in user is the sender of a chatmessage
   * used to choose the styling of the chat-bobbles
   * @param message the message to check
   * @returns {boolean} true if logged in user is sender
   */
  public checkWhichUserIsSender(message: any): boolean {
    if (message.sender == this.af.app.auth().currentUser.displayName) {
      return true;
    }
  }

}
