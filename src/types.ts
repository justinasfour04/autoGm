export enum MessageEvents {
  SEND_MESSAGES_TO_CHAT = 'sendMessagesToChat'
}

export type Messages = {
  event: MessageEvents;
  payload: string;
}