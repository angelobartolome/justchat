import { logger } from "src/utils/logger";
import http from "http";

export default async (http: http.Server) => {
  var io: SocketIO.Server = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.join("#default");
    logger.info("New client connected");
    io.to("#default").emit("message", {
      from: "admin",
      message: `User <b>${socket.id}</b> has joined the channel`,
    });

    socket.on("join-channel", (data) => {
      const { room } = data;
      socket.join(room);
    });

    socket.on("send-message", (o) => {
      const { name, message, room } = o;
      io.to(room).emit("message", {
        from: name,
        message,
      });
    });
    socket.on("disconnect", () => {
      logger.info("Client disconnected");
    });
  });

  logger.info("Socket.io Initialized");
};
