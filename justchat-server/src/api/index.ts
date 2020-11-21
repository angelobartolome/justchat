import { Router } from "express";

import auth from "./routes/auth.routes";
import room from "./routes/room.routes";

export default () => {
  const app = Router();

  app.use("/auth", auth());
  app.use("/room", room());

  return app;
};
