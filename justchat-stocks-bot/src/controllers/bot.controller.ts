import Container, { Inject, Service } from "typedi";
import { ChatBotMessage } from "src/types/chat.types";
import { CommandParser } from "src/common/command.parser";
import messages from "src/common/messages";
import { IChatService } from "src/interfaces/IChatService";
import { IStockService } from "src/interfaces/IStockService";
import ChatService from "src/services/chat.service";

@Service()
export class BotController {
  constructor(
    @Inject("chatService") private readonly chatService: IChatService,
    @Inject("stockService") private readonly stockService: IStockService,
    @Inject("botCommandParser") private readonly commandParser: CommandParser
  ) {}

  init() {
    const chatService = Container.get(ChatService);
    chatService.listenToMessages((message) => this.parseMessage(message));
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
