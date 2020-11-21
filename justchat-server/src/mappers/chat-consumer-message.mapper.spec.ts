import { ConsumeMessage } from "amqplib";
import { ChatMessage } from "src/types/chat.types";
import { ChatConsumerMessageDataMapper } from "./chat-consumer-message.mapper";

const mockChatMessage = (): ChatMessage => {
  return {
    date: new Date(),
    from: "test@test.com",
    message: "test message",
    room: "#room",
  };
};

const mockConsumeMessage = (): ConsumeMessage => {
  return {
    content: Buffer.from("message"),
    // @ts-ignore
    // ignore missing properties because we don't rely on them
    properties: {
      headers: {
        room: "#room",
        name: "author",
      },
    },
  };
};

type SutTypes = {
  sut: ChatConsumerMessageDataMapper;
};

const makeSut = (): SutTypes => {
  const sut = new ChatConsumerMessageDataMapper();
  return {
    sut,
  };
};

describe("ChatConsumerMessage DataMapper", () => {
  test("should successfully convert from ConsumeMessage", async () => {
    const { sut } = makeSut();
    const message = mockConsumeMessage();

    const chatMessage = await sut.fromDomain(message);

    expect(chatMessage.room).toEqual("#room");
    expect(chatMessage.from).toEqual("author");
    expect(chatMessage.message).toEqual("message");
  });
});
