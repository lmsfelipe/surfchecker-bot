export interface IMessage {
  senderMessage: string;
  response: string;
}

export class Message {
  data: IMessage;

  constructor(data: IMessage) {
    this.data = data;
  }
}
