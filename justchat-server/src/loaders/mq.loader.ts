import LoggerInstance from "src/utils/logger.instance";
import config from "src/config";
import amqp from "amqplib";
import { ChatBotProtocol } from "src/enums/chat.protocol";
export default async () => {
  const conn = await amqp.connect(config.brokerURI);
  const channel = await conn.createChannel();

  // Create default comm channels
  channel.assertQueue(ChatBotProtocol.BOT_REQUEST_QUEUE_ID, { durable: false });
  channel.assertQueue(ChatBotProtocol.BOT_RESPONSE_QUEUE_ID, {
    durable: false,
  });

  LoggerInstance.info("Rabbit.MQ amqplib Initialized");
  return channel;
};
