// Protocols our server receives
export enum ChatInputProtocol {
  JOIN_CHANNEL = "join_channel",
  SEND_MESSAGE = "send_message",
}

// Protocols our clients receives
export enum ChatOutputProtocol {
  JOIN_CHANNEL = "user_joined_channel",
  SEND_MESSAGE = "user_sent_message",
}

export type ChatIncomingMessage = {
  message: string;
  room: string;
};

export type ChatMessage = {
  from: string;
  message: string;
};
