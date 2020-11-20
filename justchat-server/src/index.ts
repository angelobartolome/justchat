import "reflect-metadata";
import express from "express";
import http from "http";

import config from "./config";
import loaders from "./loaders";
import LoggerInstance from "./utils/logger.instance";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  await loaders({ expressApp: app, httpServer });

  httpServer.listen(config.port, () => {
    LoggerInstance.info(`Your server is ready on port ${config.port}!`);
  });
}

startServer();
