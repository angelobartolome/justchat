import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 3004,
  brokerUri: process.env.BROKER_URI,
  stockUrl: process.env.STOCK_URL,
  botName: "SuperStocksBot",
};
