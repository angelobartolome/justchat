import { EventSubscriber, On } from "event-dispatch";
import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import config from "src/config";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import { RoomEvents } from "src/enums/room.events";
import RoomService from "src/services/room.service";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import Container from "typedi";

@SocketController()
@EventSubscriber()
export class ChannelController {
  constructor(private roomService: RoomService) {}

  @OnConnect()
  async connection(@ConnectedSocket() socket: AuthenticatedSocket) {
    const roomList = await this.roomService.getRooms();
    const roomNames = roomList.map(({ name }) => name);

    // Send available channels to user
    socket.emit(ChatOutputProtocol.AVAILABLE_CHANNELS, roomNames);

    // joins user to default channel
    await this.joinChannel(socket, {
      room: config.defaultChannel,
    });
  }

  // message when user wants to join channel
  @On(RoomEvents.ROOM_CREATED)
  async notifyNewChannels(name: string) {
    // this function is ran out of scope,
    // so we need to gather all dependencies again
    const roomService = Container.get<RoomService>(RoomService);
    const io = Container.get<Server>(Server);
    const roomList = await roomService.getRooms();
    const roomNames = roomList.map(({ name }) => name);

    io.emit(ChatOutputProtocol.AVAILABLE_CHANNELS, roomNames);
  }

  // message when user wants to join channel
  @OnMessage(ChatInputProtocol.JOIN_CHANNEL)
  async joinChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const channel = message.room;

    // Leave from previous rooms
    this.leaveFromRooms(socket);

    // Join desired room
    socket.join(channel);

    // Send recent messages through socket.
    const messages = await this.roomService.getRecentMessages(message.room);

    socket.emit(ChatOutputProtocol.JOIN_CHANNEL, {
      channel,
      messages,
    });
  }

  leaveFromRooms(socket: Socket) {
    const { rooms, id } = socket;
    rooms.forEach((room) => {
      if (room !== id) {
        socket.leave(room);
      }
    });
  }
}
