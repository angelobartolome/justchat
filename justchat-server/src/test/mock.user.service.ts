import { IUserService } from "src/interfaces/user.service";
import { User, UserDTO } from "src/models/user.model";
import { Service } from "typedi";

@Service()
export default class FakeUserService implements IUserService {
  fakeId = 0;
  users: User[] = [];

  async createUser(user: UserDTO): Promise<User> {
    const userModel = {
      email: user.email,
      id: (++this.fakeId).toString(),
      name: user.name,
      password: user.password,
    };

    this.users.push(userModel);
    return userModel;
  }

  async getUser(id: string): Promise<User> {
    return this.users.find((c) => c.id === id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.users.find((c) => c.email === email);
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }
}
