import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const SignUpValidationSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    surname: {
      type: 'string',
    },
  },
  required: ['email', 'password', 'name', 'surname'],
} as const satisfies JSONSchema

export const SignUpSchema = {
  body: SignUpValidationSchema,
  tags: [tags.Authentication],
  description: 'Sign Up API',
  response: {
    // 200: {
    //   type: "object",
    //   properties: {
    //     results: { type: "array", items: { $ref: "productSchema#" } },
    //   },
    // },
  },
}

export const SignInValidationSchema = {
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

export const SignInSchema = {
  body: SignInValidationSchema,
  tags: [tags.Authentication],
  description: 'Sign In request',
}

export const GoogleAuthValidationSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
  },
  required: ['accessToken'],
  description: 'OAuth 2.0 with Google',
} as const satisfies JSONSchema

export const GoogleAuthSchema = {
  query: GoogleAuthValidationSchema,
  tags: [tags.Authentication],
  description: 'Google Authentication',
  response: {
    // 200: {
    //   type: "object",
    //   properties: {
    //     results: { type: "array", items: { $ref: "productSchema#" } },
    //   },
    // },
  },
}
