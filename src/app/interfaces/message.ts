import { Stream } from "openai/streaming";
import { ChatRole } from "../enums/chatrole";
import { ChatCompletionChunk } from "openai/resources";

export interface IMessage {
  role: ChatRole;
  datetime: Date;
  content: string | undefined;
  responseStream: Stream<ChatCompletionChunk>| undefined;
}
