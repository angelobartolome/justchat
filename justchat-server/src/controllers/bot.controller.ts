import {
  SocketController,
  MessageBody,
  OnMessage,
  ConnectedSocket,
} from "socket-controllers";
import { Server } from "socket.io";
import {
  ChatBotProtocol,
  ChatInputProtocol,
  ChatOutputProtocol,
} from "src/enums/chat.protocol";
import Container, { Inject } from "typedi";
import amqplib from "amqplib";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import UserService from "src/services/user.service";
import { ChatIncomingMessage, ChatMessage } from "src/types/chat.types";

@SocketController()
export class BotController {
  constructor(
    @Inject("channel") private readonly channel: amqplib.Channel,
    private readonly userService: UserService
  ) {}

  setupConsumer() {
    // We handle here messages that bot wants to send to people
    this.channel.consume(ChatBotProtocol.BOT_RESPONSE_QUEUE_ID, (message) => {
      this.channel.ack(message);
      this.handleMessage(message);
    });
  }

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
      this.channel.sendToQueue(
        ChatBotProtocol.BOT_REQUEST_QUEUE_ID,
        Buffer.from(message),
        {
          headers: {
            channel: room,
            answerTo: user.name,
          },
        }
      );
    }
  }

  async handleMessage(message: amqplib.ConsumeMessage) {
    const io = Container.get<Server>(Server);

    const room = message.properties.headers["channel"];
    const name = message.properties.headers["name"];

    const output: ChatMessage = {
      date: new Date(),
      from: name,
      message: message.content.toString(),
    };

    io.to(room).emit(ChatOutputProtocol.SEND_MESSAGE, output);
  }
}
