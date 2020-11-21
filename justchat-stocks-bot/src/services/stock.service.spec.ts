import StockService from "./stock.service";

jest.mock("node-fetch", () => {
  return jest.fn(
    () =>
      new Promise((resolve) => {
        resolve({ status: 201, text: () => "Close\n100.01" });
      })
  );
});

type SutTypes = {
  sut: StockService;
};

const makeSut = (): SutTypes => {
  const sut = new StockService();
  return {
    sut,
  };
};

describe("Stock Service command parser", () => {
  test("should successfully parse stock info from CSV", async () => {
    const { sut } = makeSut();
    const stock = "fake.us";

    const result = await sut.getData(stock);

    expect(result).toEqual(100.01);
  });
});
