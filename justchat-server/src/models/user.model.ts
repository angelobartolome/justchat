import { prop as Prop, pre } from "@typegoose/typegoose";
import * as bcrypt from "bcrypt";

@pre<User>("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
})
export class User {
  id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;
}

export interface UserDTO {
  name: string;
  email: string;
  password: string;
}
