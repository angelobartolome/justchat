import diLoader from "./di.loader";
import expressLoader from "./express.loader";
import initialDbLoader from "./initial.db.loader";
import mongooseLoader from "./mongoose.loader";
import mqLoader from "./mq.loader";
import socketIoLoader from "./socket.io.loader";

export default async ({ expressApp, httpServer }) => {
  const channel = await mqLoader();

  await diLoader({ channel });
  await mongooseLoader();
  await socketIoLoader(httpServer);
  await expressLoader(expressApp);
  await initialDbLoader();
};
