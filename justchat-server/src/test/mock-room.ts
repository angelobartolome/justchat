import faker from "faker";
import { Room, RoomMessage } from "src/models/room.model";

export const mockRoom = (): Room => {
  let messages = Array(100)
    .fill("1")
    .map((c) => {
      return {
        message: faker.lorem.text(1),
        createdAt: faker.date.between(
          new Date(2020, 10, 10),
          new Date(2020, 10, 20)
        ),
        user: {
          name: faker.name.firstName(),
        },
        updatedAt: new Date(),
      } as RoomMessage;
    });

  return {
    name: "room",
    messages,
  } as Room;
};
