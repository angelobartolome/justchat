import { getModelForClass } from "@typegoose/typegoose";
import defaultTransform from "src/helpers/default.transform";
import { User } from "src/models/user.model";
import amqplib from "amqplib";
import { logger } from "src/utils/logger";
import Container from "typedi";

export default async ({ channel }: { channel: amqplib.Channel }) => {
  Container.set("userModel", getModelForClass(User, defaultTransform));
  Container.set("channel", channel);

  logger.info("Dependency-Injection Initialized");
};
