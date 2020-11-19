// Protocols our server receives
export enum ChatInputProtocol {
  JOIN_CHANNEL = "join_channel",
  SEND_MESSAGE = "send_message",
}

// Protocols our clients receives
export enum ChatOutputProtocol {
  JOIN_CHANNEL = "user_joined_channel",
  SEND_MESSAGE = "user_sent_message",
  AVAILABLE_CHANNELS = "update_available_channels",
}

// Protocols our bot uses
export enum ChatBotProtocol {
  BOT_REQUEST_QUEUE_ID = "bot_request_channel",
  BOT_RESPONSE_QUEUE_ID = "bot_response_channel",
}
