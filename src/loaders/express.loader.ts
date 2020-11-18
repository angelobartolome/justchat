import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { logger } from "src/utils/logger";
import api from "src/api";

export default async (app: express.Application) => {
  app.enable("trust proxy");

  app.use(cors());
  app.use(require("morgan")("dev"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(api());

  logger.info("Express Initialized");

  return app;
};
