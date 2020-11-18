import { Socket } from "socket.io";

type Usertoken = {
  name: string;
};

export type AuthenticatedSocket = Socket & {
  decoded_token: Usertoken;
};
