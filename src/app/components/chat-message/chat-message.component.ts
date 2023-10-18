import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { response } from 'express';
import { ICompletion } from 'src/app/interfaces/completion';
import { IMessage } from 'src/app/interfaces/message';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements AfterViewInit {
  @Input() message!: IMessage;
  messageContent: string = ''

  async ngAfterViewInit() {
    if (this.message.content) {
      this.messageContent = this.message.content
    }
    else if (this.message.responseStream) {
      for await (const part of this.message.responseStream) {
        if(part.choices[0]?.delta?.content) {
          this.messageContent = this.messageContent + part.choices[0]?.delta?.content
        }
      }
    }
  }
}
