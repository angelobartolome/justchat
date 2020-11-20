import { IAuthService } from "src/interfaces/auth.service";
import { IUserService } from "src/interfaces/user.service";
import { Service } from "typedi";

@Service()
export default class FakeAuthService implements IAuthService {
  constructor(private userService: IUserService) {}

  async authenticate(email: string, password: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) return false;

    return user.password === password;
  }
}
