import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import { logger } from "src/utils/logger";

@SocketController()
export class ChannelController {
  @OnConnect()
  connection(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: AuthenticatedSocket
  ) {
    // TODO: Send user the list of channels

    // joins user to default channel
    const channel = "#default";
    socket.join(channel);
    socket.emit("join", channel);

    // io.to(channel).emit("message", {
    //   from: "admin",
    //   message: `User ${socket.decoded_token.name} has joined the channel`,
    // });
  }

  @OnMessage("join-channel")
  joinChannel(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const channel = message.room;
    socket.join(channel);
    socket.emit("join", channel);
  }
}
