import { promisify } from "util";
import * as bcrypt from "bcrypt";

const compare = promisify(bcrypt.compare);

export default compare;
