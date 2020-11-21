import {
  SocketController,
  MessageBody,
  OnMessage,
  ConnectedSocket,
} from "socket-controllers";
import { Server } from "socket.io";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import Container, { Inject } from "typedi";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import { ChatIncomingMessage, ChatMessage } from "src/types/chat.types";
import MessageBrokerService from "src/services/message-broker.service";
import { logger } from "@typegoose/typegoose/lib/logSettings";
import { IUserService } from "src/interfaces/user.service";

@SocketController()
export class BotController {
  constructor(
    private readonly mbService: MessageBrokerService,
    @Inject("userService") private readonly userService: IUserService
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

    // starts with /, it's a bot command
    // could be improved using regex, but for
    // this application, it's totally fine.
    // If it's not a bot command, we have nothing
    // else to do here.
    if (!message.startsWith("/")) return;

    // We fetch user info so we could use more data in the future
    // for now, we could just use user's name from JWT
    const user = await this.userService.getUser(socket.decoded_token.id);

    // Don't throw error, as we can't handle outside of socket.
    if (!user) {
      logger.error("Oops, someone sent message but has invalid user id");
      return;
    }

    // Put message on bot's queue
    this.mbService.sendMessage({
      ...incomingMessage,
      date: new Date(),
      from: user.name,
    });
  }
}
