import { IMessage } from "./message";

export interface IChoice {
  message?: IMessage;
  finish_reason: string;
  index: number;
  delta?: IMessage;
}
