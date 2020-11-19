import { StockCommand } from "src/enums/chat.protocol";
import { Service } from "typedi";
import StockService from "src/services/stock.service";
import ChatService from "src/services/chat.service";
import { ChatBotMessage } from "src/types/chat.types";

@Service()
export class BotController {
  constructor(
    private readonly chatService: ChatService,
    private readonly stockService: StockService
  ) {}

  async init() {
    this.chatService.listenToMessages((message) => this.parseMessage(message));
  }

  async parseMessage(message: ChatBotMessage) {
    const { room, text } = message;

    // Invalid command
    if (!StockCommand.test(text)) {
      await this.chatService.sendMessage(
        "Sorry, invalid command, try for example: /stock=googl.us",
        room
      );
      return;
    }

    // Get first match of regex
    const [ticker] = new RegExp(/(?<=\/stock=)(\w|\.)*/).exec(text);

    const data = await this.stockService.getData(ticker);
    if (!data) throw new Error("Unable to find data related to " + ticker);

    const reply = `${ticker.toUpperCase()} quote is $${data} per share`;

    await this.chatService.sendMessage(reply, room);
  }
}
