import { UserDTO } from "src/models/user.model";
import { mockValidUser } from "src/test/mock-account";
import FakeUserService from "src/test/mock.user.service";
import AuthService from "./auth.service";

let validUser: UserDTO;
let invalidUser: UserDTO;

let userService = new FakeUserService();

jest.mock(`src/helpers/compare.password`, () => {
  return jest.fn().mockImplementation((a, b) => a === b);
});

type SutTypes = {
  sut: AuthService;
};

const makeSut = (): SutTypes => {
  const sut = new AuthService(userService);
  return {
    sut,
  };
};

describe("UserService", () => {
  beforeAll(() => {
    validUser = mockValidUser();
    userService.createUser(validUser);

    invalidUser = {
      ...validUser,
      email: "invalid@email.com",
      password: "invalid",
    };
  });

  test("should throw error if user not found", async () => {
    const { sut } = makeSut();
    const { email, password } = invalidUser;

    try {
      await sut.authenticate(email, password);
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });

  test("should return false if user found but invalid password", async () => {
    const { sut } = makeSut();

    try {
      const res = await sut.authenticate(validUser.email, invalidUser.password);
      expect(res).toBeFalsy();
    } catch (error) {
      expect(error).toBeNull();
    }
  });

  test("should return true to correct credentials", async () => {
    const { sut } = makeSut();

    const res = await sut.authenticate(validUser.email, validUser.password);
    expect(res).toBeTruthy();
  });
});
