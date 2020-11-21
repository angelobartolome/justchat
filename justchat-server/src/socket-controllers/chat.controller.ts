import {
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketIO,
} from "socket-controllers";
import { Server } from "socket.io";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import { IRoomService } from "src/interfaces/room.service";
import { IUserService } from "src/interfaces/user.service";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import { ChatIncomingMessage, ChatMessage } from "src/types/chat.types";
import { Inject } from "typedi";

@SocketController()
export class ChatController {
  constructor(
    @Inject("userService") private readonly userService: IUserService,
    @Inject("roomService") private roomService: IRoomService
  ) {}

  @OnMessage(ChatInputProtocol.SEND_MESSAGE)
  async sendMessage(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() incomingMessage: ChatIncomingMessage
  ) {
    const user = await this.userService.getUser(socket.decoded_token.id);
    const { message, room } = incomingMessage;

    const output: ChatMessage = {
      ...incomingMessage,
      date: new Date(),
      from: user.name,
    };

    // Do not save commands on database
    if (!message.startsWith("/"))
      await this.roomService.saveMessage(user, room, message);

    // Here we left some room for improvement, such as
    // word filtering for e.g.

    io.to(room).emit(ChatOutputProtocol.SEND_MESSAGE, output);
  }
}
