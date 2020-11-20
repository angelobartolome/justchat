import UserService from "src/services/user.service";
import FakeUserService from "src/test/mock.user.service";
import request from "supertest";
import { Container } from "typedi";
import express from "express";
import AuthService from "src/services/auth.service";
import FakeAuthService from "src/test/mock.auth.service";
import expressLoader from "src/loaders/express.loader";
import { User, UserDTO } from "src/models/user.model";
import { mockValidUser } from "src/test/mock-account";
import jwt, { decode } from "jsonwebtoken";

let app;
let validUser: UserDTO;
let invalidUser: UserDTO;
let missingParametersUser: UserDTO;

describe("Auth Routes and Controller", () => {
  beforeAll(async () => {
    const fakeUserService = new FakeUserService();
    const fakeAuthService = new FakeAuthService(fakeUserService);

    Container.set(UserService, fakeUserService);
    Container.set(AuthService, fakeAuthService);

    app = express();
    await expressLoader(app);

    validUser = mockValidUser();
    invalidUser = { ...validUser, password: "invalid" };
    missingParametersUser = { ...validUser, password: null };
  });

  test("should return 200 with valid jwt on signup with good data", async () => {
    await request(app)
      .post("/auth/signUp")
      .send(validUser)
      .expect(200)
      .then((response) => {
        expect(response.body.token).not.toBeUndefined();

        const decoded = jwt.decode(response.body.token) as User;
        expect(decoded.name).toEqual(validUser.name);
      });
  });

  test("should return 400 on signup with missing data", async () => {
    await request(app)
      .post("/auth/signUp")
      .send(missingParametersUser)
      .expect(400);
  });

  test("should return 401 on signin with unknown user", async () => {
    await request(app).post("/auth/signIn").send(invalidUser).expect(401);
  });

  test("should return 200 with valid jwt on signin with known user", async () => {
    await request(app)
      .post("/auth/signIn")
      .send({
        email: validUser.email,
        password: validUser.password,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.token).not.toBeUndefined();

        const decoded = jwt.decode(response.body.token) as User;
        expect(decoded.name).toEqual(validUser.name);
      });
  });
});
