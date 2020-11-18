import { logger } from "src/utils/logger";
import http from "http";
import defaultConfig from "src/config/socket.io";
import { useSocketServer } from "socket-controllers";
import { ChatController } from "src/controllers/chat.controller";

export default async (http: http.Server) => {
  const io: SocketIO.Server = require("socket.io")(http, defaultConfig);
  useSocketServer(io, {
    controllers: [ChatController],
  });

  logger.info("Socket.io Initialized");
};
