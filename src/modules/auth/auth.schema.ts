import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'
import { FastifySchema } from 'fastify'

export const SignUpValidation = {
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
  },
  required: ['name', 'email', 'password'],
} as const satisfies JSONSchema

export const SignUpSchema = {
  body: SignUpValidation,
  tags: [tags.Authentication],
  summary: 'Sign Up API',
}

export const SignInValidation = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      default: 'deneme@gmail.com',
    },
    password: {
      type: 'string',
      default: 'deneme',
    },
  },
  required: ['email', 'password'],
} as const satisfies JSONSchema

export const SignInSchema: FastifySchema = {
  body: SignInValidation,
  tags: [tags.Authentication],
  summary: 'Sign In request',
}

export const GoogleAuthValidation = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
  },
  required: ['accessToken'],
  description: 'OAuth 2.0 with Google',
} as const satisfies JSONSchema

export const GoogleAuthSchema: FastifySchema = {
  querystring: GoogleAuthValidation,
  tags: [tags.Authentication],
  summary: 'Google Authentication',
}
