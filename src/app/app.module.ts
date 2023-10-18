import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { APP_CONFIG, AppConfig } from './app.config';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';

@NgModule({
  declarations: [
    AppComponent,
    ChatMessageComponent,
    ScrollToBottomDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
