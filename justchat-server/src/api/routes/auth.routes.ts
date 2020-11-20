import { Router } from "express";
import AuthService from "src/services/auth.service";
import UserService from "src/services/user.service";
import Container from "typedi";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
export default (app: Router) => {
  app.use("/auth", router);

  const authService = Container.get(AuthService);
  const userService = Container.get(UserService);
  const controller = new AuthController(authService, userService);

  router.post("/signIn", (req, res) => controller.signIn(req, res));
  router.post("/signUp", (req, res) => controller.signUp(req, res));
};
