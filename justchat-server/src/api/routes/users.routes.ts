import { Router } from "express";
import UserService from "src/services/user.service";
import { UserToken } from "src/types/user.token";
import Container from "typedi";

import jwt from "jsonwebtoken";
import config from "src/config";

const router = Router();
export default (app: Router) => {
  app.use("/users", router);
  const userService = Container.get(UserService);

  router.get("/", async (req, res, next) => {
    const users = await userService.getUsers();
    res.status(200).json(users);
  });

  router.post("/", async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = await userService.createUser({
        email,
        name,
        password,
      });

      const userToken: UserToken = {
        id: user.id,
        name,
      };

      const token = jwt.sign(userToken, config.secret);
      return res.json({ user, token }).status(200);
    } catch (e) {
      return next(e);
    }
  });
};
