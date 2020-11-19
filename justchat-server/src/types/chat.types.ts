export type ChatIncomingMessage = {
  message: string;
  room: string;
};

export type ChatMessage = {
  date: Date;
  from: string;
  message: string;
};
