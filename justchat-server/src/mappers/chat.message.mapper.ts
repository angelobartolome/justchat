import { DataMapper } from "src/helpers/data.mapper.base";
import { RoomMessage } from "src/models/room.model";
import { User } from "src/models/user.model";
import { ChatMessage } from "src/types/chat.types";

export class ChatMessageDataMapper
  implements DataMapper<ChatMessage, RoomMessage> {
  fromDomain(domain: RoomMessage): ChatMessage {
    const { createdAt, message, user } = domain;
    const { name } = user as User;

    return {
      date: createdAt,
      message: message,
      from: name,
    };
  }
  toDomain(entity: ChatMessage): RoomMessage {
    throw new Error("Method not implemented.");
  }
}
