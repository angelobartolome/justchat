import AuthService from "src/services/auth.service";
import jwt from "jsonwebtoken";
import config from "src/config";
import { logger } from "src/utils/logger";
import UserService from "src/services/user.service";
import { Request, Response } from "express";
import { AppError } from "src/common/app.error";
import { UserDTO } from "src/models/user.model";

export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const valid = await this.authService.authenticate(email, password);

      if (!valid) throw new AppError("Invalid credentials");

      const user = await this.userService.getUserByEmail(email);
      const token = jwt.sign({ id: user.id, name: user.name }, config.secret);

      return res.json({ token });
    } catch (e) {
      return res.status(401).json({ e });
    }
  }

  async signUp(req: Request, res: Response) {
    try {
      const data = req.body as UserDTO;
      const user = await this.userService.createUser(data);

      if (!user) throw new AppError("Invalid information");

      const token = jwt.sign({ id: user.id, name: user.name }, config.secret);

      return res.json({ token });
    } catch (e) {
      return res.status(401).json({ e });
    }
  }
}
