import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import {
  EventDispatcher,
  EventDispatcherInterface,
} from "src/common/event-dispatcher";
import roomConfig from "src/config/room.config";
import { RoomEvents } from "src/enums/room.events";
import { ServiceBase } from "src/helpers/service.base";
import { IRoomService } from "src/interfaces/room.service";
import { ChatMessageDataMapper } from "src/mappers/chat-message.mapper";
import { Room } from "src/models/room.model";
import { User } from "src/models/user.model";
import { ChatMessage } from "src/types/chat.types";
import { Service, Inject } from "typedi";

@Service("roomService")
export default class RoomService
  extends ServiceBase<Room>
  implements IRoomService {
  constructor(
    @Inject("roomModel") model: ReturnModelType<typeof Room>,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {
    super(model);
  }

  async createRoom(name: string): Promise<Room> {
    const existing = await this.getRoomByName(name);

    if (existing) return;

    const createdDocument = new this.model({ name });

    await createdDocument.save();

    this.eventDispatcher.dispatch(RoomEvents.ROOM_CREATED, name);

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

  async getRecentMessages(roomName: string): Promise<ChatMessage[]> {
    const room = await this.getRoomByName(roomName);

    // Althought data already comes sorted from MongoDB structure
    // we make sure.
    const roomMessages = room.messages.sort(
      (a, b) => a.createdAt?.getTime() - b.createdAt?.getTime()
    );

    // Convert RoomMessages to ChatMessage
    const chatMessages: ChatMessage[] = roomMessages
      .slice(-roomConfig.recentMessageCount)
      .map((c) => new ChatMessageDataMapper().fromDomain(c));

    return chatMessages;
  }
}
