import {
  IMessageBrokerService,
  ChatListenCallback,
} from "src/interfaces/chat.service";
import { Inject, Service } from "typedi";
import amqplib from "amqplib";
import { ChatBotProtocol } from "src/enums/chat.protocol";
import { ChatMessage } from "src/types/chat.types";

@Service()
export default class MessageBrokerService implements IMessageBrokerService {
  constructor(@Inject("channel") private readonly channel: amqplib.Channel) {}

  async listenToMessages(callback: ChatListenCallback) {
    this.channel.consume(
      ChatBotProtocol.BOT_RESPONSE_QUEUE_ID,
      async (message) => {
        this.channel.ack(message);

        const room = message.properties.headers["room"];
        const name = message.properties.headers["name"];

        callback({
          room,
          from: name,
          date: new Date(),
          message: message.content.toString(),
        });
      }
    );
  }

  async sendMessage(message: ChatMessage): Promise<void> {
    this.channel.sendToQueue(
      ChatBotProtocol.BOT_REQUEST_QUEUE_ID,
      Buffer.from(message.message),
      {
        headers: {
          name: message.from,
          room: message.room,
        },
      }
    );
  }
}
