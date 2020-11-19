import {
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import {
  ChatBotProtocol,
  ChatIncomingMessage,
  ChatInputProtocol,
  ChatMessage,
  ChatOutputProtocol,
} from "src/enums/chat.protocol";
import UserService from "src/services/user.service";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import Container, { Inject } from "typedi";
import amqplib from "amqplib";
import config from "src/config";

@SocketController()
export class BotController {
  constructor(@Inject("channel") private readonly channel: amqplib.Channel) {}

  setupConsumer() {
    // We handle here messages that bot wants to send to people
    this.channel.consume(ChatBotProtocol.BOT_RESPONSE_QUEUE_ID, (message) => {
      this.handleMessage(message);
    });
  }

  @OnMessage(ChatInputProtocol.SEND_MESSAGE)
  async sendMessage(@MessageBody() incomingMessage: ChatIncomingMessage) {
    const { message, room } = incomingMessage;

    // starts with /, it's a bot command
    if (message.startsWith("/")) {
      this.channel.sendToQueue("bots", Buffer.from(message));
    }
  }

  async handleMessage(message: amqplib.ConsumeMessage) {
    const io = Container.get<Server>(Server);

    const output: ChatMessage = {
      from: "bot",
      message: message.content.toString(),
    };

    // TODO: get channel from bot
    io.to(config.defaultChannel).emit(ChatOutputProtocol.SEND_MESSAGE, output);
  }
}
