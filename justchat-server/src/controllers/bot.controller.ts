import { SocketController, MessageBody, OnMessage } from "socket-controllers";
import { Server } from "socket.io";
import {
  ChatBotProtocol,
  ChatIncomingMessage,
  ChatInputProtocol,
  ChatMessage,
  ChatOutputProtocol,
} from "src/enums/chat.protocol";
import Container, { Inject } from "typedi";
import amqplib from "amqplib";

@SocketController()
export class BotController {
  constructor(@Inject("channel") private readonly channel: amqplib.Channel) {}

  setupConsumer() {
    // We handle here messages that bot wants to send to people
    this.channel.consume(
      ChatBotProtocol.BOT_RESPONSE_QUEUE_ID,
      (message) => {
        this.handleMessage(message);
      },
      {
        noAck: false,
      }
    );
  }

  @OnMessage(ChatInputProtocol.SEND_MESSAGE)
  async sendMessage(@MessageBody() incomingMessage: ChatIncomingMessage) {
    const { message, room } = incomingMessage;

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
      from: name,
      message: message.content.toString(),
    };

    io.to(room).emit(ChatOutputProtocol.SEND_MESSAGE, output);
  }
}
