import { Router } from "express";
import auth from "./routes/auth.routes";
import users from "./routes/users.routes";

export default () => {
  const app = Router();
  users(app);
  auth(app);

  return app;
};
