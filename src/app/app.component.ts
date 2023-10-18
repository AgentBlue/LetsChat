import { Component, Inject } from '@angular/core';
import { APP_CONFIG, IAppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lets-chat';
  userInput: any;

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  onSendMessage() {
    throw new Error('Method not implemented.');
  }

  inputChanged($event: any) {
    throw new Error('Method not implemented.');
  }

  onKeyUp($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }
}
