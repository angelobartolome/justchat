import { Request, Response } from "express";
import { Inject } from "typedi";
import { IRoomService } from "src/interfaces/room.service";

export class RoomController {
  constructor(@Inject("roomService") private roomService: IRoomService) {}

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      await this.roomService.createRoom(name);

      return res.status(201).end();
    } catch (e) {
      return res.status(401).json({ e: e.message });
    }
  }
}
