import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { compare } from "src/helpers/compare.password";
import { ServiceBase } from "src/helpers/service.base";
import { IAuthService } from "src/interfaces/IAuthService";
import { IUserService } from "src/interfaces/IUserService";
import { Service } from "typedi";
import UserService from "./user.service";

@Service()
export default class AuthService implements IAuthService {
  constructor(private userService: UserService) {}

  async authenticate(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      return await compare(password, user.password);
    }

    throw new Error("User not found");
  }
}
