import dotenv from "dotenv";
import env from "env-var";
dotenv.config();

export default {
  port: env.get("PORT").default("3000").asPortNumber(),
  databaseURI: env.get("DATABASE_URI").asString(),
  secret: env.get("SECRET").asString(),
  defaultChannel: "#default",
  brokerURI: process.env.BROKER_URI,
};
