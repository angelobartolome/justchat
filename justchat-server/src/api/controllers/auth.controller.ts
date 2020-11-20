import jwt from "jsonwebtoken";
import config from "src/config";
import { Request, Response } from "express";
import { AppError } from "src/common/app.error";
import { UserDTO } from "src/models/user.model";
import { Inject } from "typedi";
import { IUserService } from "src/interfaces/user.service";
import { IAuthService } from "src/interfaces/auth.service";

export class AuthController {
  constructor(
    @Inject("authService") private authService: IAuthService,
    @Inject("userService") private userService: IUserService
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
