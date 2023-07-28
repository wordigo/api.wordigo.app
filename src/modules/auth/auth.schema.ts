import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const LoginValidationSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: ['email', 'password'],
} as const satisfies JSONSchema

export const LoginSchema = {
  body: LoginValidationSchema,
  tags: [tags.Authentication],
  description: 'Authentication login request',
  response: {
    // 200: {
    //   type: "object",
    //   properties: {
    //     results: { type: "array", items: { $ref: "productSchema#" } },
    //   },
    // },
    404: { $ref: 'messageResponseSchema#' },
  },
}

export const GoogleAuthSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
  },
  required: ['accessToken'],
} as const satisfies JSONSchema

export const GoogleAuthValidation = {
  query: GoogleAuthSchema,
  tags: [tags.Authentication],
  description: 'Google Auth',
  response: {
    // 200: {
    //   type: "object",
    //   properties: {
    //     results: { type: "array", items: { $ref: "productSchema#" } },
    //   },
    // },
    404: { $ref: 'messageResponseSchema#' },
  },
}
