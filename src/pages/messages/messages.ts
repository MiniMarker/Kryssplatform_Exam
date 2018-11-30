import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Chat} from "../../models/Chat";
import {Toast} from "@ionic-native/toast";

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  private userAsSenderCollection: AngularFirestoreCollection<Chat>;
  private userAsRecieverCollection: AngularFirestoreCollection<Chat>;

  private userAsSender: Observable<Chat[]>;
  private userAsReciever: Observable<Chat[]>;
  private userAsSenderArray: Array<Chat> = [];
  private userAsRecieverArray: Array<Chat> = [];
  private usersMessagesArray: Array<Chat> = [];

  private chats: Observable<Chat[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore,
              private toast: Toast) {

    this.userAsSenderCollection = this.af.collection<Chat>("chats", (ref) => {
      return ref
        .where('senderUid', '==', this.af.app.auth().currentUser.uid)
    });

    this.userAsRecieverCollection = this.af.collection<Chat>("chats", (ref) => {
      return ref
        .where('reciverUid', '==', this.af.app.auth().currentUser.uid)
    });
  }

  private ionViewWillEnter(): void{

    this.userAsSender = this.userAsSenderCollection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Chat;
          let id = action.payload.doc.id;

          return {
            id, ...data
          };
        });
      });

    this.userAsReciever = this.userAsRecieverCollection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          let data = action.payload.doc.data() as Chat;
          let id = action.payload.doc.id;

          return {
            id, ...data
          };
        });
      });

    //this merges the two async arrays
    this.userAsSender.subscribe((res) => {
      this.userAsSenderArray = res as Chat[];

      this.userAsReciever.subscribe((res) => {
        this.userAsRecieverArray = res as Chat[];

        //merge and sort
        this.usersMessagesArray = [...this.userAsSenderArray, ...this.userAsRecieverArray]
          .sort((n1, n2) => n2.latestMessageTimeStamp - n1.latestMessageTimeStamp);
      });
    });
  }

  public checkWhichNameToDisplay(chat: Chat): boolean {
    if (chat.reciverUid == this.af.app.auth().currentUser.uid) {
      return true;
    }
  }

  public goToChatPage(chat: Chat): void {
    this.navCtrl.push("ChatPage", {
      chat
    })
  }

}
