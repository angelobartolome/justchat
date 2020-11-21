import { Inject, Service } from "typedi";
import StockService from "src/services/stock.service";
import ChatService from "src/services/chat.service";
import { ChatBotMessage } from "src/types/chat.types";
import { CommandParser } from "src/common/command.parser";
import messages from "src/common/messages";

@Service()
export class BotController {
  constructor(
    private readonly chatService: ChatService,
    private readonly stockService: StockService,
    @Inject("botCommandParser") private readonly commandParser: CommandParser
  ) {}

  async init() {
    this.chatService.listenToMessages((message) => this.parseMessage(message));
  }

  async parseMessage(message: ChatBotMessage) {
    const { room, text } = message;
    let ticker: string;

    try {
      ticker = await this.commandParser.parseCommand(text);
    } catch (error) {
      await this.chatService.sendMessage(messages.invalidCommand(), room);
      return;
    }

    const data = await this.stockService.getData(ticker);

    if (!data) throw new Error(messages.dataNotAvailable(ticker));

    await this.chatService.sendMessage(messages.quote(ticker, data), room);
  }
}
