import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class ChatController {
  @OnConnect()
  connection(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
    io.to("#default").emit("message", {
      from: "admin",
      message: `User <b>${socket.id}</b> has joined the channel`,
    });
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: Socket) {
    console.log("client disconnected");
  }

  @OnMessage("join-channel")
  joinChannel(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    socket.join(message.room);
  }

  @OnMessage("send-message")
  sendMessage(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() o: any
  ) {
    const { name, message, room } = o;
    io.to(room).emit("message", {
      from: name,
      message,
    });
  }
}
