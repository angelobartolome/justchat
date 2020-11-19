import { logger } from "src/utils/logger";
import http from "http";
import defaultConfig from "src/config/socket.io";
import { useContainer, useSocketServer } from "socket-controllers";
import { ChatController } from "src/controllers/chat.controller";
import socketIoJwt from "socketio-jwt";
import config from "src/config";
import { ChannelController } from "src/controllers/channel.controller";
import { BotController } from "src/controllers/bot.controller";
import { Container } from "typedi";
import { Server } from "socket.io";

export default async (http: http.Server) => {
  const io: SocketIO.Server = require("socket.io")(http, defaultConfig);

  io.use(
    socketIoJwt.authorize({
      secret: config.secret,
      handshake: true,
    })
  );

  useContainer(Container);
  useSocketServer(io, {
    controllers: [ChatController, ChannelController, BotController],
  });

  // Only needed when functions are not in the scope of @SocketServer
  Container.set(Server, io);

  // Setup BotController as now we have io instance
  const botController = Container.get<BotController>(BotController);
  botController.setupConsumer();

  logger.info("Socket.io Initialized");
};
