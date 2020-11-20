import faker from "faker";
import { UserDTO } from "src/models/user.model";

export const mockValidUser = (): UserDTO => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});
