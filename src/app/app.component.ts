import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { APP_CONFIG, IAppConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { Message } from './interfaces/message';
import { ChatRole } from './enums/chatrole';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lets-chat'
  @ViewChild(ScrollToBottomDirective) 
  scrollToBottom!: ScrollToBottomDirective;
  userInput: any;
  messages: Message[] = [];

  constructor(public http: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  ngOnInit(): void {
    this.initChat()
  }

  initChat() {
    // send first chat message
    this.sendMessage("Hi")
  }

  onSendMessage() {
    // only send message to open ai if message is long enough
    if (this.userInput.length < 2) {
      return
    }

    this.sendMessage(this.userInput)

    // clear chat input
    this.clearInput()
  }

  sendMessage(input: string, messageVisible: boolean = true) {

    if (messageVisible) {
      const userMsg: Message = {
        role: ChatRole.User,
        datetime: new Date(),
        content: input,
        eventSource: undefined,
      }
      this.messages.push(userMsg)
    }

    const chatPayload = {
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: ChatRole.User,
          content: input,
        }
      ],
      temperature: 0.7
    }

    const response = this.http.post<any>(
      `${this.config.openAiBaseUrl}/chat/completions`,
      chatPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openAiApiKey}`,
        }
      }
    )

    response.subscribe(resp => {
      console.log(resp)

      const botMsg: Message = {
        role: ChatRole.Assistant,
        datetime: new Date(),
        content: resp.choices[0].message.content,
        eventSource: undefined,
      }
      this.messages.push(botMsg)

    })
  }

  inputChanged(event: any) {
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSendMessage();
    }
  }

  clearInput() {
    this.userInput = ''
  }
}
