import { ChatBotProtocol, StockCommand } from "src/enums/chat.protocol";
import { Inject, Service } from "typedi";
import amqplib, { ConsumeMessage } from "amqplib";
import pkg from "../../package.json";

@Service()
export class BotController {
  constructor(@Inject("channel") private readonly channel: amqplib.Channel) {}

  async init() {
    this.channel.consume(ChatBotProtocol.BOT_REQUEST_QUEUE_ID, (message) => {
      this.channel.ack(message);
      this.parseMessage(message);
    });
  }

  async parseMessage(message: ConsumeMessage) {
    const { content, properties } = message;
    const { channel } = properties.headers;
    const text = content.toString();

    // Invalid command
    if (!StockCommand.test(text)) return;

    // Get first match of regex
    const [ticker] = new RegExp(/(?<=\/stock=)(\w|\.)*/).exec(text);

    this.channel.sendToQueue(
      ChatBotProtocol.BOT_RESPONSE_QUEUE_ID,
      Buffer.from("Command accepted: " + ticker),
      {
        headers: {
          name: pkg.name,
          channel: channel,
        },
      }
    );
  }
}
