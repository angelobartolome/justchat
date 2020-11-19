import { prop as Prop, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { User } from "./user.model";

export class RoomMessage extends TimeStamps {
  @Prop({ ref: "User", index: true, autopopulate: { maxDepth: 1 } })
  user: Ref<User>;

  @Prop()
  message: string;
}

export class Room {
  id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: RoomMessage })
  messages: RoomMessage[];
}
