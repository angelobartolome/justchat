import { promisify } from "util";
import * as bcrypt from "bcrypt";

export const compare = promisify(bcrypt.compare);
