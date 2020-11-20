import { getModelForClass } from "@typegoose/typegoose";
import defaultTransform from "src/helpers/default.transform";
import { User } from "src/models/user.model";
import amqplib from "amqplib";
import { logger } from "src/utils/logger";
import Container from "typedi";
import { Room } from "src/models/room.model";
import UserService from "src/services/user.service";

export default async ({ channel }: { channel: amqplib.Channel }) => {
  Container.set("userModel", getModelForClass(User, defaultTransform));
  Container.set("roomModel", getModelForClass(Room, defaultTransform));

  Container.set("channel", channel);

  Container.set("userService", UserService);
  logger.info("Dependency-Injection Initialized");
};
