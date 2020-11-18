import { getModelForClass } from "@typegoose/typegoose";
import defaultTransform from "src/helpers/default.transform";
import { User } from "src/models/user.model";

import { logger } from "src/utils/logger";
import Container from "typedi";

export default async () => {
  Container.set("userModel", getModelForClass(User, defaultTransform));
  logger.info("Dependency-Injection Initialized");
};
