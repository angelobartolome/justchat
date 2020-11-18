import { Router } from "express";
import AuthService from "src/services/auth.service";
import UserService from "src/services/user.service";
import Container from "typedi";

const router = Router();
export default (app: Router) => {
  app.use("/auth", router);
  const authService = Container.get(AuthService);

  router.post("/", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const valid = await authService.authenticate(email, password);

      if (valid) {
        return res.status(200).json({ fine: true });
      }

      return res.status(400).end();
    } catch (e) {
      return res.status(500).end();
    }
  });
};
