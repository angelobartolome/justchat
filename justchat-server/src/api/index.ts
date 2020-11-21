import { Router } from "express";
import auth from "./routes/auth.routes";

export default () => {
  const app = Router();

  app.use("/auth", auth());

  return app;
};
