import mongoose from "mongoose";
import config from "src/config";
import { logger } from "src/utils/logger";

export default async (): Promise<any> => {
  const connection = await mongoose.connect(config.databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  logger.info("MongoDB Initialized");

  return connection.connection.db;
};
