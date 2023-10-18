import { IChoice } from "./choice";
import { IUsage } from "./usage";

export interface ICompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: IUsage;
  choices: IChoice[];
}
