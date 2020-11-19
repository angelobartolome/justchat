import { Socket } from "socket.io";
import { UserToken } from "./user.token";

export type AuthenticatedSocket = Socket & {
  decoded_token: UserToken;
};
