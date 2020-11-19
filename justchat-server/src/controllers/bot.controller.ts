import {
  SocketController,
  MessageBody,
  OnMessage,
  ConnectedSocket,
} from "socket-controllers";
import { Server } from "socket.io";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import Container, { Inject } from "typedi";
import amqplib from "amqplib";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import UserService from "src/services/user.service";
import { ChatIncomingMessage, ChatMessage } from "src/types/chat.types";
import MessageBrokerService from "src/services/message.broker.service";

@SocketController()
export class BotController {
  constructor(
    @Inject("channel") private readonly channel: amqplib.Channel,
    private readonly mbService: MessageBrokerService,
    private readonly userService: UserService
  ) {}

  setupConsumer() {
    // We handle here messages that bot wants to send to people
    this.mbService.listenToMessages((msg) => this.handleMessage(msg));
  }

  async handleMessage(message: ChatMessage) {
    // We directly forward messages coming from bot
    const io = Container.get<Server>(Server);
    io.to(message.room).emit(ChatOutputProtocol.SEND_MESSAGE, message);
  }

  // Here we intercept messages that contains
  // our magic character /
  @OnMessage(ChatInputProtocol.SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() incomingMessage: ChatIncomingMessage
  ) {
    const { message, room } = incomingMessage;
    const user = await this.userService.getUser(socket.decoded_token.id);

    // starts with /, it's a bot command
    // could be improved using regex, but for
    // this application, it's totally fine.
    if (message.startsWith("/")) {
      this.mbService.sendMessage({
        date: new Date(),
        from: user.name,
        message,
        room,
      });
    }
  }
}
