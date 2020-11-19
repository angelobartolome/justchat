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
        let room = "#default";

        try {
          const {
            content,
            properties: { headers },
          } = message;

          room = headers["room"] || room;

          await callback({
            text: String(content),
            room: room,
            from: headers["name"],
          });
        } catch (error) {
          logger.error(error);
          await this.sendMessage(
            "Sorry, i can't to complete your request 🤭",
            room
          );
        }
      }
    );
  }

  async sendMessage(text: string, room: string): Promise<void> {
    const params = {
      headers: {
        name: config.botName,
        room: room,
      },
    };

    this.channel.sendToQueue(
      ChatBotProtocol.BOT_RESPONSE_QUEUE_ID,
      Buffer.from(text),
      params
    );
  }
}
