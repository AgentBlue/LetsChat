import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { APP_CONFIG, IAppConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { IMessage } from './interfaces/message';
import { ChatRole } from './enums/chatrole';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';

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

    const signal = this.abortController.signal
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.openAiApiKey}`,
    }
    const requestBody = {
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: ChatRole.USER,
          content: input,
        }
      ],
      temperature: 0.7,
      stream: true
    }
    const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      signal
    }
    const url = `${this.config.openAiBaseUrl}/chat/completions`

    try {
      const response: Promise<Response> = fetch(url, options)
      
      const botMsg: IMessage = {
        role: ChatRole.ASSISTANT,
        datetime: new Date(),
        content: undefined,
        response: response,
      }
      this.messages.push(botMsg)

    } catch (error) {
      if (signal.aborted) {
        console.error('Request aborted.');
      } else {
        this.handleError(error);
      }
    } finally {
      this.stopCompletions();
    }
  }

  handleError(error: any) {
    console.error('Error:', error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request was aborted');
    } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error occurred');
    } else if (error instanceof TypeError && error.message === 'Failed to decode') {
      throw new Error('Error decoding response from server');
    } else if (error instanceof TypeError && error.message ===
      'JSON.parse: unexpected end of data at line 1 column 1 of the JSON data') {
      throw new Error('Invalid JSON response from server');
    } else if (error instanceof TypeError && error.message ===
      'response.body?.pipeThrough(...).getReader is not a function') {
      throw new Error('Invalid response from server');
    } else {
      throw new Error('Unknown error occurred');
    }
  }

  stopCompletions() {
    this.abortController.abort();
    console.log('Stream stoped')
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
