import { IRoomService } from "src/interfaces/room.service";
import { Room } from "src/models/room.model";
import { User } from "src/models/user.model";

export default class FakeRoomService implements IRoomService {
  createRoom: (name: String) => Promise<Room>;
  getRooms: () => Promise<Room[]>;
  getRoomByName: (name: string) => Promise<Room>;

  async saveMessage(user: User, name: string, message: string) {
    // Do nothing...
    return;
  }
}
