import { FastifySchema } from 'fastify'
import { tags } from '../../utils/constants/Tags'
import { JSONSchema } from 'json-schema-to-ts'

export const GetUserByIdValidation = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
} as const satisfies JSONSchema

export const GetUserMeSchema: FastifySchema = {
  // headers: GetUserMeValidation,
  tags: [tags.Users],
  description: 'Get user information',
  security: [{ JWT: [] }],
}

export const GetUserByIdSchema: FastifySchema = {
  querystring: GetUserByIdValidation,
  tags: [tags.Users],
  description: 'Getting User By Id',
  security: [{ JWT: [] }],
}
