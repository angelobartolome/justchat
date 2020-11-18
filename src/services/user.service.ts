import { getModelForClass } from "@typegoose/typegoose";
import { ServiceBase } from "src/helpers/ServiceBase";
import { IUserService } from "src/interfaces/IUserService";
import { User, UserDTO } from "src/models/user.model";

export default class UserService extends ServiceBase<User>  implements IUserService {
  constructor() {
    super(getModelForClass(User));
  }

  async createUser(user: UserDTO): Promise<User> {
    const createdDocument = new this.model(user);

    createdDocument.save();
    return createdDocument;
  }

  async getUser(id: string): Promise<User> {
    return this.model.findById(id)
  }
}
