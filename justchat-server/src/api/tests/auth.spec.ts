import UserService from "src/services/user.service";
import FakeUserService from "src/test/mock.user.service";
import request from "supertest";
import { Container } from "typedi";
import express from "express";
import FakeAuthService from "src/test/mock.auth.service";
import { AuthController } from "src/api/controllers/auth.controller";
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

    Container.set(
      AuthController,
      new AuthController(fakeAuthService, fakeUserService)
    );

    app = express();
    await expressLoader(app);

    validUser = mockValidUser();
    invalidUser = { ...validUser, password: "invalid" };
    missingParametersUser = { ...validUser, password: null };
  });

  test("should return 200 with valid jwt on sign-up with good data", async () => {
    await request(app)
      .post("/auth/sign-up")
      .send(validUser)
      .expect(200)
      .then((response) => {
        expect(response.body.token).not.toBeUndefined();

        const decoded = jwt.decode(response.body.token) as User;
        expect(decoded.name).toEqual(validUser.name);
      });
  });

  test("should return 400 on sign-up with missing data", async () => {
    await request(app)
      .post("/auth/sign-up")
      .send(missingParametersUser)
      .expect(400);
  });

  test("should return 401 on sign-in with unknown user", async () => {
    await request(app).post("/auth/sign-in").send(invalidUser).expect(401);
  });

  test("should return 200 with valid jwt on sign-in with known user", async () => {
    await request(app)
      .post("/auth/sign-in")
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
