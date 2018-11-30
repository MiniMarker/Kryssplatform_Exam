import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMessagePage } from './send-message';

@NgModule({
  declarations: [
    SendMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(SendMessagePage),
  ],
})
export class SendMessagePageModule {}
