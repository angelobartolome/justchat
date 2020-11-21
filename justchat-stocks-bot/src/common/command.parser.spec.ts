import { StockBotCommandParser } from "./command.parser";
import messages from "./messages";

type SutTypes = {
  sut: StockBotCommandParser;
};

const makeSut = (): SutTypes => {
  const sut = new StockBotCommandParser();
  return {
    sut,
  };
};

describe("Stock Bot command parser", () => {
  test("should successfully extract stock code from command", async () => {
    const { sut } = makeSut();
    const message = "/stock=aapl.us";

    const result = await sut.parseCommand(message);

    expect(result).toEqual("aapl.us");
  });

  test("should throw error if command is invalid", async () => {
    const { sut } = makeSut();
    const message = "/stack=aapl.us";

    await expect(sut.parseCommand(message)).rejects.toThrow(
      messages.invalidCommand()
    );
  });

  test("should throw error if stock is invalid", async () => {
    const { sut } = makeSut();
    const message = "/stock=$$$$";

    await expect(sut.parseCommand(message)).rejects.toThrow(
      messages.invalidStock()
    );
  });
});
