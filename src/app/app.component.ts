import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { APP_CONFIG, IAppConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { IMessage } from './interfaces/message';
import { ChatRole } from './enums/chatrole';
import OpenAI from 'openai';
import { ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming } from 'openai/resources';
import { Stream } from 'openai/streaming';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'lets-chat'
  openAi!: OpenAI
  streamChat: boolean = false
  userInput: any;
  messages: IMessage[] = []

  constructor(public http: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  ngAfterViewInit(): void {
    this.initOpenAi()
    this.initChat()
  }

  initOpenAi() {
    this.openAi = new OpenAI({
      apiKey: this.config.openAiApiKey,
      dangerouslyAllowBrowser: true,
    })
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
        responseStream: undefined
      }
      this.messages.push(userMsg)
      this.scrollToBottom()
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

    const chatPayload: ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: ChatRole.USER,
          content: input,
        }
      ],
      temperature: 0.7
    }

    this.openAi.chat.completions.create(chatPayload).then(response => {
      const botMsg: IMessage = {
        role: ChatRole.ASSISTANT,
        datetime: new Date(),
        content: response.choices[0].message.content || '',
        responseStream: undefined
      }
      this.messages.push(botMsg)
      this.scrollToBottom()
    })
  }

  sendMessageStreamed(input: string) {

    const chatPayload: ChatCompletionCreateParamsStreaming = {
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: ChatRole.USER,
          content: input,
        }
      ],
      temperature: 0.7,
      stream: true,
    }

    this.openAi.chat.completions.create(chatPayload).then(async stream => {

      const botMsg: IMessage = {
        role: ChatRole.ASSISTANT,
        datetime: new Date(),
        content: undefined,
        responseStream: stream
      }
      this.messages.push(botMsg)
      this.scrollToBottom()
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

  scrollToBottom(): void {
    const chatHistory = document.querySelector('.chat-history');
    setTimeout(() => {
      if (chatHistory) {
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }
    }, 50);
  }
}
