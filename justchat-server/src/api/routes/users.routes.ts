import { Router } from "express";
import UserService from "src/services/user.service";
import Container from "typedi";

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
      return res.json({ user }).status(200);
    } catch (e) {
      return next(e);
    }
  });
};
