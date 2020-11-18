import diLoader from "./di.loader";
import expressLoader from "./express.loader";
import mongooseLoader from "./mongoose.loader";
import socketIoLoader from "./socket.io.loader";

export default async ({ expressApp, httpServer }) => {
  await diLoader();
  await mongooseLoader();
  await socketIoLoader(httpServer);
  await expressLoader(expressApp);
};
