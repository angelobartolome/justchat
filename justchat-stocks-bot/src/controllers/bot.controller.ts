import { Inject, Service } from "typedi";
import { ChatBotMessage } from "src/types/chat.types";
import { CommandParser } from "src/common/command.parser";
import messages from "src/common/messages";
import { IChatService } from "src/interfaces/IChatService";
import { IStockService } from "src/interfaces/IStockService";

@Service()
export class BotController {
  constructor(
    @Inject("chatService") private chatService: IChatService,
    @Inject("stockService") private stockService: IStockService,
    @Inject("botCommandParser") private commandParser: CommandParser
  ) {}

  init() {
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
