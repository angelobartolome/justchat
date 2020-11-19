import { Service } from "typedi";
import IStockService from "./stock.service";

@Service()
export default class StockService implements IStockService {}
