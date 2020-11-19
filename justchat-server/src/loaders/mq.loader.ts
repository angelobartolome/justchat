import { logger } from "src/utils/logger";
import config from "src/config";
import amqp from "amqplib";
import { ChatBotProtocol } from "src/enums/chat.protocol";
export default async () => {
  const conn = await amqp.connect(config.brokerUri);
  const channel = await conn.createChannel();

  // Create default comm channels
  channel.assertQueue(ChatBotProtocol.BOT_REQUEST_QUEUE_ID, { durable: false });
  channel.assertQueue(ChatBotProtocol.BOT_RESPONSE_QUEUE_ID, {
    durable: false,
  });

  logger.info("Rabbit.MQ amqplib Initialized");
  return channel;
};
