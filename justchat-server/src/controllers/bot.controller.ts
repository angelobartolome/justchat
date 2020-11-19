import {
  SocketController,
  MessageBody,
  OnMessage,
  ConnectedSocket,
} from "socket-controllers";
import { Server } from "socket.io";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import Container from "typedi";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import UserService from "src/services/user.service";
import { ChatIncomingMessage, ChatMessage } from "src/types/chat.types";
import MessageBrokerService from "src/services/message.broker.service";
import { logger } from "@typegoose/typegoose/lib/logSettings";

@SocketController()
export class BotController {
  constructor(
    private readonly mbService: MessageBrokerService,
    private readonly userService: UserService
  ) {}

  setupConsumer() {
    // We handle here messages that bot wants to send to people
    this.mbService.listenToMessages((msg) => this.handleMessage(msg));
  }

  async handleMessage(message: ChatMessage) {
    // We directly forward messages coming from bot
    // need to get through Container.get as @Inject on
    // Socket.io is not available in this scope.
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
    const { message } = incomingMessage;

    const user = await this.userService.getUser(socket.decoded_token.id);

    // Don't throw error, as we can't handle outside of socket.
    if (!user) {
      logger.error("Oops, someone sent message but has invalid user id");
      return;
    }

    // starts with /, it's a bot command
    // could be improved using regex, but for
    // this application, it's totally fine.
    if (message.startsWith("/")) {
      this.mbService.sendMessage({
        ...incomingMessage,
        date: new Date(),
        from: user.name,
      });
    }
  }
}
