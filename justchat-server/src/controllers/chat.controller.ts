import {
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketIO,
} from "socket-controllers";
import { Server } from "socket.io";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import RoomService from "src/services/room.service";
import UserService from "src/services/user.service";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import { ChatIncomingMessage, ChatMessage } from "src/types/chat.types";

@SocketController()
export class ChatController {
  constructor(
    private userService: UserService,
    private roomService: RoomService
  ) {}

  @OnMessage(ChatInputProtocol.SEND_MESSAGE)
  async sendMessage(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() incomingMessage: ChatIncomingMessage
  ) {
    // fetch user, so we don't rely on JWT's user information
    // for additional safety reasons.
    const user = await this.userService.getUser(socket.decoded_token.id);
    const { message, room } = incomingMessage;

    const output: ChatMessage = {
      date: new Date(),
      from: user.name,
      message: message,
    };

    // There's room for improvement here
    if (!message.startsWith("/"))
      await this.roomService.saveMessage(user, room, message);

    // Here we left some room for improvement, such as
    // word filtering for e.g.

    io.to(room).emit(ChatOutputProtocol.SEND_MESSAGE, output);
  }
}
