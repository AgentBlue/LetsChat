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
  messageContent!: string

  ngAfterViewInit() {
    if (this.message.content) {
      this.messageContent = this.message.content
    }
    else if (this.message.response) {

      this.message.response.then(response => {
        const reader: ReadableStreamDefaultReader<string> | undefined
          = response.body?.pipeThrough(new TextDecoderStream()).getReader()

        if (!reader) {
          throw new Error('Error occurred while creating stream reader')
        }
        if (this.message.content) {
          this.messageContent = this.message.content
        }
        else {
          if (reader) {
            let processing = true
            while (processing) {
              reader.read().then(({ done, value }) => {
                if (done) {
                  processing = false
                }

                if (value) {
                  const lines: string[] = value.split('\n');
                  const parsedLines: ICompletion[] = this.getParsedStreamedCompletionResponse(lines);
                  for (const line of parsedLines) {
                    const { choices } = line;
                    const { delta } = choices[0];
                    if (delta?.content) {
                      this.messageContent = this.messageContent.concat(delta.content)
                    }
                  }
                }
              })
            }
          }
        }
      })
    }
  }

  getParsedStreamedCompletionResponse(lines: string[]): ICompletion[] {
    return lines
      .map((line) => line.replace(/^data: /, '').trim())
      .filter((line) => line !== '' && line !== '[DONE]')
      .map((line) => JSON.parse(line));
  }
}
