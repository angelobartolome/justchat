import { ChatBotParserRegex } from "src/enums/chat.protocol";
import { Service } from "typedi";
import messages from "./messages";

export abstract class CommandParser {
  abstract async parseCommand(command: string): Promise<string>;
  abstract async validateCommand(command: string): Promise<void>;
}

@Service("botCommandParser")
export class StockBotCommandParser implements CommandParser {
  async parseCommand(command: string): Promise<string> {
    this.validateCommand(command);

    const [firstMatch] = ChatBotParserRegex.TicketParserRegex.exec(command);

    return firstMatch;
  }

  validateCommand(command: string): Promise<void> {
    this.ensureCommmandIsValid(command);
    this.ensureTickerIsValid(command);

    return;
  }

  ensureCommmandIsValid(command: string) {
    if (!ChatBotParserRegex.CommandRegex.test(command))
      throw new Error(messages.invalidCommand());
  }

  ensureTickerIsValid(command: string) {
    if (
      !ChatBotParserRegex.TicketParserRegex.test(command) ||
      !ChatBotParserRegex.TicketParserRegex.exec(command)[0]
    )
      throw new Error(messages.invalidStock());
  }
}
