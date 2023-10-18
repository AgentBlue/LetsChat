import { ChatRole } from "../enums/chatrole";

export interface IMessage {
  role: ChatRole;
  datetime: Date;
  content: string | undefined;
  response: Promise<Response>| undefined;
}
