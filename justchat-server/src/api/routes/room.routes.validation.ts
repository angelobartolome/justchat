import { expressYupMiddleware } from "express-yup-middleware";

import * as Yup from "yup";

const createRoomSchemaValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        name: Yup.string().required(),
      }),
    },
  },
};

export const createRoomValidator = expressYupMiddleware({
  schemaValidator: createRoomSchemaValidator,
});
