import { AppError } from "src/common/app.error";
import { compare } from "src/helpers/compare.password";
import { IAuthService } from "src/interfaces/auth.service";
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

    throw new AppError("User not found");
  }
}
