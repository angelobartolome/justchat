import { User, UserDTO } from "src/models/user.model";

export interface IAuthService {
  authenticate: (email: string, password: string) => Promise<boolean>;
}
