import { ConsumeMessage } from "amqplib";
import { DataMapper } from "src/helpers/data.mapper";
import { ChatMessage } from "src/types/chat.types";

export class ChatConsumerMessageDataMapper
  implements DataMapper<ChatMessage, ConsumeMessage> {
  fromDomain(domain: ConsumeMessage): ChatMessage {
    const room: string = domain.properties.headers["room"];
    const name: string = domain.properties.headers["name"];

    return {
      room,
      from: name,
      date: new Date(),
      message: domain.content.toString(),
    };
  }

  toDomain(entity: ChatMessage): ConsumeMessage {
    throw new Error("Method not implemented.");
  }
}
