import controllerLoader from "./controller.loader";
import diLoader from "./di.loader";
import mqLoader from "./mq.loader";

export default async () => {
  const channel = await mqLoader();

  await diLoader({ channel });
  await controllerLoader();
};
