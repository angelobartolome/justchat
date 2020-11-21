import "reflect-metadata";
import { Server, Socket } from "socket.io";
import { User } from "src/models/user.model";
import { mockValidUser } from "src/test/mock-account";
import FakeRoomService from "src/test/mock.room.service";
import FakeUserService from "src/test/mock.user.service";
import { ChatMessage } from "src/types/chat.types";
import { ChatController } from "./chat.controller";

type SutTypes = {
  sut: ChatController;
  message: ChatMessage;
  botMessage: ChatMessage;
};

let userService = new FakeUserService();
let roomService = new FakeRoomService();

let fakeSocket = {
  decoded_token: {
    id: 1,
  },
} as Partial<Socket>;

const makeSut = (): SutTypes => {
  const sut = new ChatController(userService, roomService);
  const message = {
    date: new Date(),
    from: "anoyone",
    message: "demo",
    room: "#room",
  };

  const botMessage = {
    date: new Date(),
    from: "anoyone",
    message: "/command",
    room: "#room",
  };

  return {
    botMessage,
    message,
    sut,
  };
};

describe("Chat Controller", () => {
  beforeAll(() => {
    let user = mockValidUser();

    jest.spyOn(userService, "getUser").mockResolvedValue({
      name: user.name,
    } as User);
  });

  test("Save incoming messages in database", async () => {
    const { sut, message } = makeSut();

    const t = jest.spyOn(roomService, "saveMessage").mockResolvedValue();

    // @ts-ignore
    await sut.sendMessage(new Server(), fakeSocket, message);

    expect(t).toHaveBeenCalled();
  });

  test("Do not save incoming messages with commands in database", async () => {
    const { sut, botMessage } = makeSut();

    const t = jest.spyOn(roomService, "saveMessage").mockResolvedValue();

    // @ts-ignore
    await sut.sendMessage(new Server(), fakeSocket, botMessage);

    expect(t).not.toHaveBeenCalled();
  });
});
