import { Router } from "express";
import Container from "typedi";
import { RoomController } from "../controllers/room.controller";
import { createRoomValidator } from "./room.routes.validation";

const router = Router();

export default () => {
  const controller = Container.get(RoomController);

  router.post("/create", createRoomValidator, (req, res) =>
    controller.create(req, res)
  );

  return router;
};
