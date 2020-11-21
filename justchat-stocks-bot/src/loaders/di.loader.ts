import amqplib from "amqplib";
import ChatService from "src/services/chat.service";
import StockService from "src/services/stock.service";
import { logger } from "src/utils/logger";
import Container from "typedi";

export default async ({ channel }: { channel: amqplib.Channel }) => {
  Container.set("channel", channel);
  Container.set("chatService", ChatService);
  Container.set("stockService", StockService);

  logger.info("Dependency-Injection Initialized");
};
