import { IStockService } from "src/interfaces/IStockService";
import { Service } from "typedi";
import fetch from "node-fetch";
import config from "src/config";
import parse from "csv-parse/lib/sync";
import { logger } from "src/utils/logger";

@Service()
export default class StockService implements IStockService {
  async getData(ticker: string): Promise<number | null> {
    try {
      const response = await fetch(config.stockUrl + ticker);
      const data = await response.text();

      const [{ Close }] = await parse(data, {
        columns: true,
        skip_empty_lines: true,
      });

      const quote = Number.parseFloat(Close);

      return quote;
    } catch (error) {
      logger.error("Error while fetching data: " + error.message);
      return null;
    }
  }
}
