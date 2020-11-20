import RoomService from "./room.service";
import { mockRoom } from "src/test/mock-room";
import roomConfig from "src/config/room.config";
import { Room } from "src/models/room.model";
type SutTypes = {
  sut: RoomService;
};

const makeSut = (): SutTypes => {
  const sut = new RoomService(null);
  return {
    sut,
  };
};

let room: Room;

describe("Room Service", () => {
  beforeAll(() => {
    room = mockRoom();
  });

  test("Return messages filtering by timestamp ascending order", async () => {
    const { sut } = makeSut();

    jest.spyOn(sut, "getRoomByName").mockResolvedValue(room);
    const messages = await sut.getRecentMessages("room");

    expect(messages.length).toBeLessThanOrEqual(roomConfig.recentMessageCount);

    const orderedMessages = room.messages
      .sort((a, b) => a.createdAt?.getTime() - b.createdAt?.getTime())
      .slice(roomConfig.recentMessageCount);

    expect(messages.map((c) => c.date.getTime())).toEqual(
      expect.arrayContaining(orderedMessages.map((c) => c.createdAt.getTime()))
    );
  });
});
