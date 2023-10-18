import { Component, Inject, OnInit } from '@angular/core';
import { APP_CONFIG, IAppConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { IMessage } from './interfaces/message';
import { ChatRole } from './enums/chatrole';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lets-chat'

  streamChat: boolean = false
  userInput: any;
  messages: IMessage[] = []

  private abortController: AbortController

  constructor(public http: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig) {
    this.abortController = new AbortController()
  }

  ngOnInit(): void {
    this.initChat()
  }

  initChat() {
    this.processInput("Hi")
  }

  onSendMessage() {

    // only send message to open ai if message is long enough
    if (this.userInput.length < 2) {
      return
    }

    this.processInput(this.userInput)
  }

  processInput(input: string, messageVisible: boolean = true) {

    // clear chat input
    this.clearInput()

    // Show user message if visible
    if (messageVisible) {
      const userMsg: IMessage = {
        role: ChatRole.USER,
        datetime: new Date(),
        content: input,
        response: undefined
      }
      this.messages.push(userMsg)
    }

    // get response
    if (this.streamChat) {
      this.sendMessageStreamed(input)
    }
    else {
      this.sendMessage(input)
    }
  }

  sendMessage(input: string) {

    const chatPayload = {
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: ChatRole.USER,
          content: input,
        }
      ],
      temperature: 0.7
    }

    this.http.post<any>(
      `${this.config.openAiBaseUrl}/chat/completions`,
      chatPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openAiApiKey}`,
        }
      }
    ).subscribe(resp => {

      const botMsg: IMessage = {
        role: ChatRole.ASSISTANT,
        datetime: new Date(),
        content: resp.choices[0].message.content,
        response: undefined
      }
      this.messages.push(botMsg)
    })
  }

  sendMessageStreamed(input: string) {

    const chatPayload = {
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: ChatRole.USER,
          content: input,
        }
      ],
      temperature: 0.7
    }

    this.http.post<any>(
      `${this.config.openAiBaseUrl}/chat/completions`,
      chatPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openAiApiKey}`,
        }
      }
    ).subscribe(resp => {

      const botMsg: IMessage = {
        role: ChatRole.ASSISTANT,
        datetime: new Date(),
        content: resp.choices[0].message.content,
        response: undefined
      }
      this.messages.push(botMsg)
    })
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
