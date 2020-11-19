import { logger } from "src/utils/logger";
import Container from "typedi";
import RoomService from "src/services/room.service";
import config from "src/config/room.config";

export default async () => {
  const roomService = Container.get<RoomService>(RoomService);

  for (const room of config.defaultRooms) {
    roomService.createRoom(room);
  }

  logger.info("Migration Initialized");
};
