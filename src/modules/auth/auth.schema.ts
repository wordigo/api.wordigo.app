import { JSONSchema } from "json-schema-to-ts";

export const LoginValidationSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
  required: ["email", "password"],
} as const satisfies JSONSchema;

export const LoginSchema = {
  body: LoginValidationSchema,
  tags: ["auth"],
  description: "Authentication login request",
  response: {
    // 200: {
    //   type: "object",
    //   properties: {
    //     results: { type: "array", items: { $ref: "productSchema#" } },
    //   },
    // },
    404: { $ref: "messageResponseSchema#" },
  },
};
