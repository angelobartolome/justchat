import amqplib from "amqplib";
import { logger } from "src/utils/logger";
import Container from "typedi";

export default async ({ channel }: { channel: amqplib.Channel }) => {
  Container.set("channel", channel);

  logger.info("Dependency-Injection Initialized");
};
