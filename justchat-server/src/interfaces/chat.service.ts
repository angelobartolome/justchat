import { ChatMessage } from "src/types/chat.types";

export type ChatListenCallback = (message: ChatMessage) => Promise<void>;

export interface IMessageBrokerService {
  sendMessage(message: ChatMessage): Promise<void>;
  listenToMessages(callback: ChatListenCallback);
}
