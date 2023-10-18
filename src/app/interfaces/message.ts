import { ChatRole } from "../enums/chatrole";

export interface Message {
  role: ChatRole;
  datetime: Date;
  content: string;
  eventSource: EventSource | undefined;
}
