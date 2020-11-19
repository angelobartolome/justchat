import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  MessageBody,
  OnMessage,
} from "socket-controllers";
import { Socket } from "socket.io";
import config from "src/config";
import roomConfig from "src/config/room.config";
import { ChatInputProtocol, ChatOutputProtocol } from "src/enums/chat.protocol";
import { ChatMessageDataMapper } from "src/mappers/chat.message.mapper";
import RoomService from "src/services/room.service";
import { AuthenticatedSocket } from "src/types/authenticated.socket";
import { ChatMessage } from "src/types/chat.types";

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
    const room = await this.roomService.getRoomByName(message.room);

    // Althought data already comes sorted from MongoDB structure
    // we make sure.
    const roomMessages = room.messages.sort(
      (a, b) => a.createdAt?.getTime() - b.createdAt?.getTime()
    );

    // Convert RoomMessages to ChatMessage
    const chatMessages: ChatMessage[] = roomMessages
      .slice(-roomConfig.recentMessageCount)
      .map((c) => new ChatMessageDataMapper().fromDomain(c));

    const channel = message.room;

    // Leave from previous rooms
    this.leaveFromRooms(socket);

    socket.join(channel);

    socket.emit(ChatOutputProtocol.JOIN_CHANNEL, {
      channel,
      messages: chatMessages,
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
