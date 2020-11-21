import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
} from "socket-controllers";
import { Socket } from "socket.io";
import config from "src/config";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import RoomService from "src/services/room.service";
import { AuthenticatedSocket } from "src/types/authenticated.socket";

@SocketController()
export class ChannelController {
  constructor(private roomService: RoomService) {}

  @OnConnect()
  async connection(@ConnectedSocket() socket: AuthenticatedSocket) {
    const roomList = await this.roomService.getRooms();
    const roomNames = roomList.map(({ name }) => name);
    socket.emit(ChatOutputProtocol.AVAILABLE_CHANNELS, roomNames);

    // joins user to default channel
    await this.joinChannel(socket, {
      room: config.defaultChannel,
    });
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

    socket.join(channel);

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
