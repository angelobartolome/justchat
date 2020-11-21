import { Router } from "express";
import Container from "typedi";
import { AuthController } from "../controllers/auth.controller";
import { signUpValidator, signInValidator } from "./auth.routes.validation";

const router = Router();
export default () => {
  const controller = Container.get(AuthController);

  router.post("/signIn", signInValidator, (req, res) =>
    controller.signIn(req, res)
  );
  router.post("/signUp", signUpValidator, (req, res) =>
    controller.signUp(req, res)
  );

  return router;
};
