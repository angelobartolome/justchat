import { Inject, Service } from "typedi";
import { ChatBotProtocol } from "src/enums/chat.protocol";
import amqplib from "amqplib";
import config from "src/config";
import { IChatService, ChatListenCallback } from "src/interfaces/IChatService";
import { logger } from "src/utils/logger";

@Service()
export default class ChatService implements IChatService {
  constructor(@Inject("channel") private readonly channel: amqplib.Channel) {}

  async listenToMessages(callback: ChatListenCallback) {
    this.channel.consume(
      ChatBotProtocol.BOT_REQUEST_QUEUE_ID,
      async (message) => {
        this.channel.ack(message);
        let channel = "#default";

        try {
          const {
            content,
            properties: { headers },
          } = message;

          channel = channel || headers["channel"];

          await callback({
            text: String(content),
            channel: channel,
            from: headers["name"],
          });
        } catch (error) {
          logger.error(error);
          await this.sendMessage(
            "Sorry, i can't to complete your request 🤭",
            channel
          );
        }
      }
    );
  }

  async sendMessage(text: string, channel: string): Promise<void> {
    this.channel.sendToQueue(
      ChatBotProtocol.BOT_RESPONSE_QUEUE_ID,
      Buffer.from(text),
      {
        headers: {
          name: config.botName,
          channel: channel,
        },
      }
    );
  }
}
