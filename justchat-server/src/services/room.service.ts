import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { ServiceBase } from "src/helpers/service.base";
import { IRoomService } from "src/interfaces/room.service";
import { Room } from "src/models/room.model";
import { User } from "src/models/user.model";
import { Service, Inject } from "typedi";

@Service()
export default class RoomService
  extends ServiceBase<Room>
  implements IRoomService {
  constructor(@Inject("roomModel") model: ReturnModelType<typeof Room>) {
    super(model);
  }

  async createRoom(name: string): Promise<Room> {
    const existing = await this.getRoomByName(name);

    if (existing) return;

    const createdDocument = new this.model({ name });

    createdDocument.save();
    return createdDocument;
  }

  async getRooms(): Promise<Room[]> {
    return this.model.find({}).exec();
  }

  async getRoomByName(name: string): Promise<Room> {
    return this.model
      .findOne({ name: name })
      .populate({
        path: "messages",
        populate: {
          path: "user",
        },
      })
      .exec();
  }

  async saveMessage(user: User, name: string, message: string): Promise<void> {
    const room = (await this.getRoomByName(name)) as DocumentType<Room>;
    if (!room) return;

    room.messages = [
      ...room.messages,
      {
        message: message,
        user: user,
      },
    ];

    await room.save();
  }
}
