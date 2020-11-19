import { Room } from "src/models/room.model";
import { User } from "src/models/user.model";

export interface IRoomService {
  createRoom: (name: String) => Promise<Room>;
  getRooms: () => Promise<Room[]>;
  getRoomByName: (name: string) => Promise<Room>;

  saveMessage: (user: User, name: string, message: string) => Promise<void>;
}
