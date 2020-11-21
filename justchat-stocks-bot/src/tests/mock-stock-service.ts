import { IStockService } from "src/interfaces/IStockService";

export default class FakeStockService implements IStockService {
  getData(ticker: string): Promise<number> {
    return Promise.resolve(100);
  }
}
