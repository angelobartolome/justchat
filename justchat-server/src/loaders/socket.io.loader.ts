import { logger } from "src/utils/logger";
import http from "http";
import defaultConfig from "src/config/socket.io";
import { useSocketServer } from "socket-controllers";
import { ChatController } from "src/controllers/chat.controller";
import socketIoJwt from "socketio-jwt";
import config from "src/config";
import { ChannelController } from "src/controllers/channel.controller";
export default async (http: http.Server) => {
  const io: SocketIO.Server = require("socket.io")(http, defaultConfig);

  io.use(
    socketIoJwt.authorize({
      secret: config.secret,
      handshake: true,
    })
  );

  useSocketServer(io, {
    controllers: [ChatController, ChannelController],
  });

  logger.info("Socket.io Initialized");
};
