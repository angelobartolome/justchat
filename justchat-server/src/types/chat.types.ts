export type ChatIncomingMessage = {
  message: string;
  room: string;
};

export type ChatMessage = {
  room: string;
  date: Date;
  from: string;
  message: string;
};
