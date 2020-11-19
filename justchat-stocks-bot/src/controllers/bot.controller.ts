import { ChatBotProtocol } from "src/enums/chat.protocol";
import { Inject } from "typedi";
import amqplib from "amqplib";

export class BotController {
  constructor(@Inject("channel") private readonly channel: amqplib.Channel) {}
}
