import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookDetailsPage } from './book-details';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    BookDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BookDetailsPage),
    PipesModule
  ],
})
export class BookDetailsPageModule {}
