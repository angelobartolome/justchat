import amqplib from "amqplib";
import { StockBotCommandParser } from "src/common/command.parser";
import ChatService from "src/services/chat.service";
import StockService from "src/services/stock.service";
import { logger } from "src/utils/logger";
import Container from "typedi";

export default async ({ channel }: { channel: amqplib.Channel }) => {
  Container.set("channel", channel);

  Container.set("chatService", Container.get(ChatService));
  Container.set("botCommandParser", Container.get(StockBotCommandParser));
  Container.set("stockService", Container.get(StockService));

  logger.info("Dependency-Injection Initialized");
};
