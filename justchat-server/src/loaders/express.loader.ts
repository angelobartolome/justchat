import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import api from "src/api";
import LoggerInstance from "src/utils/logger.instance";

export default async (app: express.Application) => {
  app.enable("trust proxy");

  app.use(cors());
  app.use(require("morgan")("dev"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(api());

  LoggerInstance.info("Express Initialized");

  return app;
};
