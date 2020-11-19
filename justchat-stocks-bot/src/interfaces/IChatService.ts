import { ChatBotMessage } from "src/types/chat.types";

export type ChatListenCallback = (message: ChatBotMessage) => Promise<void>;

export interface IChatService {
  sendMessage(text: string, channel: string): Promise<void>;
  listenToMessages(callback: ChatListenCallback);
}
