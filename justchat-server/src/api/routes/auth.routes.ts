import { Router } from "express";
import AuthService from "src/services/auth.service";
import UserService from "src/services/user.service";
import Container from "typedi";
import jwt from "jsonwebtoken";
import config from "src/config";
import { logger } from "src/utils/logger";

const router = Router();
export default (app: Router) => {
  app.use("/auth", router);

  const authService = Container.get(AuthService);
  const userService = Container.get(UserService);

  router.post("/", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const valid = await authService.authenticate(email, password);

      if (valid) {
        const user = await userService.getUserByEmail(email);
        const token = jwt.sign({ id: user.id, name: user.name }, config.secret);
        return res.status(200).json({ token });
      }

      return res.status(400).end();
    } catch (e) {
      logger.error(e);
      return res.status(400).end();
    }
  });
};
