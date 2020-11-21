import { StockBotCommandParser } from "src/common/command.parser";
import messages from "src/common/messages";
import FakeChatService from "src/tests/mock-chat-service";
import FakeStockService from "src/tests/mock-stock-service";
import { BotController } from "./bot.controller";

let chatService = new FakeChatService();
let stockService = new FakeStockService();

type SutTypes = {
  sut: BotController;
};

const makeSut = (): SutTypes => {
  const sut = new BotController(
    chatService,
    stockService,
    new StockBotCommandParser()
  );
  return {
    sut,
  };
};

describe("Bot controller", () => {
  test("should send message when data is correctly fetched", async () => {
    const { sut } = makeSut();
    const ticker = "fake.us";
    const fakePrice = 100.0004;
    const command = "/stock=" + ticker;

    const spyMe = jest.spyOn(chatService, "sendMessage").mockResolvedValue();
    jest.spyOn(stockService, "getData").mockResolvedValue(fakePrice);

    const room = "#room";

    await sut.parseMessage({
      from: "none",
      room,
      text: command,
    });

    expect(spyMe).toBeCalledWith(messages.quote(ticker, fakePrice), room);
  });
});
