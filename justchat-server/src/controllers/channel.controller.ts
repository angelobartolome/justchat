import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import config from "src/config";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import { AuthenticatedSocket } from "src/types/authenticated.socket";

@SocketController()
export class ChannelController {
  @OnConnect()
  connection(@ConnectedSocket() socket: AuthenticatedSocket) {
    // TODO: Send user the list of channels

    // joins user to default channel
    socket.join(config.defaultChannel);
    socket.emit(ChatOutputProtocol.JOIN_CHANNEL, config.defaultChannel);
  }

  // message when user wants to join channel
  @OnMessage(ChatInputProtocol.JOIN_CHANNEL)
  joinChannel(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const channel = message.room;
    socket.join(channel);
    socket.emit(ChatOutputProtocol.JOIN_CHANNEL, channel);
  }
}
