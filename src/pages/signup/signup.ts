import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Camera} from "@ionic-native/camera";
import {AngularFirestore} from "angularfire2/firestore";
import {AngularFireStorage} from "angularfire2/storage";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  private previewImg: string = "";
  private user = {
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private af: AngularFirestore,
              private afStorage: AngularFireStorage) {

  }

  /**
   * Uses AngularFirestore Authentication to log in with email and password given in
   * the input fields.
   * I also save some additional data to the user:
   *    photoURL: profile picure
   *    displayName: a concatenated string following template: <firstname> <lastname>
   *
   * Uploads the base64 string in previewImg to AngularFireStorage with template name:
   *    '<logged in users email>_<Date().getTime()>.png'
   */
  public registerUser():void {
    this.af.app.auth()
      .createUserWithEmailAndPassword(this.user.username, this.user.password)
      .then(res => {

        //naming picture file
        let imgFileName: string = `${this.af.app.auth().currentUser.email}_${new Date().getTime()}.png`;

        //uploading picture file to firebase storage
        this.afStorage.ref(imgFileName)
          .putString(this.previewImg, 'base64', {
            contentType: 'image/png'
          }).downloadURL().subscribe((uploadImgUrl) => {

          //adding additional data to a user
          this.af.app.auth().currentUser.updateProfile({

            photoURL: uploadImgUrl,
            displayName: `${this.user.firstName} ${this.user.lastName}`,

          });
        });
      })
      .catch(err => {
        console.log(err)
      });
  }


  /**
   * Use Ionic Native's Camera Plugin to select a picture form the local photo library with given options:
   *    Base64
   *    JPEG encoding
   *    Correct Orientation
   */
  public choosePicture():void {

    //Launch photo library
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, //Use photolibrary
      destinationType: this.camera.DestinationType.DATA_URL, //Use Base64
      encodingType: this.camera.EncodingType.JPEG, //Use JPEG as encoding
      correctOrientation: true //User correct orentation
    }).then(
      imgBase64 => {
        this.previewImg = imgBase64;
      }
    )
  }

  /**
   * Use Ionic Native's Camera Plugin to take a picture with given options:
   *    Back camera
   *    JPEG encoding
   *    Base64
   *    Correct Orientation
   */
  public executeCamera():void {
    //Launch camera
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL, //Use Base64
      encodingType: this.camera.EncodingType.JPEG, //Use JPEG as encoding
      cameraDirection: this.camera.Direction.FRONT, //Use front camera
      correctOrientation: true //User correct orentation
    }).then(
      imgBase64 => {
        this.previewImg = imgBase64;
      }
    )
  }

  /*
      Navigation
   */
  public goToLoginPage():void {
    this.navCtrl.push('LoginPage', {});
  }

}
