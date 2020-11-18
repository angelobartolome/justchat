import { User, UserDTO } from "src/models/user.model";

export interface IUserService {
    createUser: (user: UserDTO) => Promise<User>
    getUser: (id: string) => Promise<User>
}