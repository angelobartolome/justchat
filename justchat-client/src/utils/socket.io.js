import io from "socket.io-client";

let socket;

export const initiateSocket = (token) => {
  socket = io("http://localhost:3000", {
    query: `token=${token}`,
  });
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const subscribeToChat = (cb) => {
  if (!socket) return true;

  socket.on("user_sent_message", (msg) => {
    console.log("Websocket event received!");
    return cb(null, msg);
  });
};

export const joinChannel = (channel) => {
  if (!socket) return true;

  socket.emit("join_channel", {
    room: channel,
  });
};

export const subscribeToChannel = (cb) => {
  if (!socket) return true;

  socket.on("user_joined_channel", (data) => {
    console.log(data);
    return cb(null, data);
  });
};

export const subscribeToChannelList = (cb) => {
  if (!socket) return true;

  socket.on("update_available_channels", (data) => {
    console.log(data);
    return cb(null, data);
  });
};

export const sendMessage = (channel, message) => {
  if (socket) {
    socket.emit("send_message", {
      message,
      room: channel,
    });
  }
};
