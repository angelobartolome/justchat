import { expressYupMiddleware } from "express-yup-middleware";

import * as Yup from "yup";

const signUpSchemaValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
      }),
    },
  },
};

const signInSchemaValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required(),
      }),
    },
  },
};

export const signUpValidator = expressYupMiddleware({
  schemaValidator: signUpSchemaValidator,
});

export const signInValidator = expressYupMiddleware({
  schemaValidator: signInSchemaValidator,
});
