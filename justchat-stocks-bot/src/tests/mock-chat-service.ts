import { ChatListenCallback, IChatService } from "src/interfaces/IChatService";

export default class FakeChatService implements IChatService {
  sendMessage(text: string, channel: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  listenToMessages(callback: ChatListenCallback) {
    throw new Error("Method not implemented.");
  }
}
