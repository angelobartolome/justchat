import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 3004,
  brokerUri: process.env.BROKER_URI,
  stockUrl: "https://stooq.com/q/l/?f=sd2t2ohlcv&h&e=csv&s=",
};
