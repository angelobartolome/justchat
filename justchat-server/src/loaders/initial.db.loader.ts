import { logger } from "src/utils/logger";
import Container from "typedi";
import RoomService from "src/services/room.service";
import config from "src/config";

export default async () => {
  const roomService = Container.get<RoomService>(RoomService);

  roomService.createRoom(config.defaultChannel);
  roomService.createRoom("#gaming");

  logger.info("Migration Initialized");
};
