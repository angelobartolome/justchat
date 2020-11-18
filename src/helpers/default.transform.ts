export default {
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  },
};
