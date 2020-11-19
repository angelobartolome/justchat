import {
  IMessageBrokerService,
  ChatListenCallback,
} from "src/interfaces/chat.service";
import { Inject, Service } from "typedi";
import amqplib from "amqplib";
import { ChatBotProtocol } from "src/enums/chat.protocol";
import { ChatMessage } from "src/types/chat.types";
import { ChatConsumerMessageDataMapper } from "src/mappers/chat.consumer.message.mapper";

@Service()
export default class MessageBrokerService implements IMessageBrokerService {
  constructor(@Inject("channel") private readonly channel: amqplib.Channel) {}

  async listenToMessages(callback: ChatListenCallback) {
    this.channel.consume(
      ChatBotProtocol.BOT_RESPONSE_QUEUE_ID,
      async (message) => {
        this.channel.ack(message);
        callback(new ChatConsumerMessageDataMapper().fromDomain(message));
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
