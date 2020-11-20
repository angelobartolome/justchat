import mongoose from "mongoose";
import config from "src/config";
import LoggerInstance from "src/utils/logger.instance";

export default async (): Promise<any> => {
  const connection = await mongoose.connect(config.databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  LoggerInstance.info("MongoDB Initialized");

  return connection.connection.db;
};
