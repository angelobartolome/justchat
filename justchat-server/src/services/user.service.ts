import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { ServiceBase } from "src/helpers/service.base";
import { IUserService } from "src/interfaces/user.service";
import { User, UserDTO } from "src/models/user.model";
import { Service, Inject } from "typedi";

@Service()
export default class UserService
  extends ServiceBase<User>
  implements IUserService {
  constructor(@Inject("userModel") model: ReturnModelType<typeof User>) {
    super(model);
  }

  async createUser(user: UserDTO): Promise<User> {
    const createdDocument = new this.model(user);

    createdDocument.save();
    return createdDocument;
  }

  async getUser(id: string): Promise<User> {
    return this.model.findById(id).exec();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.model.findOne({ email: email }).exec();
  }

  async getUsers(): Promise<User[]> {
    return this.model.find().exec();
  }
}
