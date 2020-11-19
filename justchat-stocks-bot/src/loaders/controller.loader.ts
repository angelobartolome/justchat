import amqplib from "amqplib";
import { BotController } from "src/controllers/bot.controller";
import { logger } from "src/utils/logger";
import Container from "typedi";

export default async () => {
  const botController = Container.get<BotController>(BotController);
  botController.init();

  logger.info("Controller Initialized");
};
