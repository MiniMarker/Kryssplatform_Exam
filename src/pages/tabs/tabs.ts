import { Component } from '@angular/core';

import { MainPage } from '../main/main';
import { ProfilePage } from '../profile/profile';
import {AddBookPage} from "../add-book/add-book";
import {MessagesPage} from "../messages/messages";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  //Setting the root pages on tapping the different icons in tab bar
  tab1Root = MainPage;
  tab2Root = AddBookPage;
  tab3Root = ProfilePage;
  tab4Root = MessagesPage;

  constructor() {

  }
}
