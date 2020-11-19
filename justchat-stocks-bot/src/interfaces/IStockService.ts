export interface IStockService {
  getData(ticker: string): Promise<number | null>;
}
