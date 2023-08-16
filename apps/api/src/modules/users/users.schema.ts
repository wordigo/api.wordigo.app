import { FastifySchema } from 'fastify'
import { tags } from '../../utils/constants/Tags'
import { JSONSchema } from 'json-schema-to-ts'

export const GetByIdValidation = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
} as const satisfies JSONSchema

export const GetMeSchema: FastifySchema = {
  // headers: GetUserMeValidation,
  tags: [tags.Users],
  summary: 'Getting User Information',
  security: [{ JWT: [] }],
}

export const GetByIdSchema: FastifySchema = {
  querystring: GetByIdValidation,
  tags: [tags.Users],
  summary: 'Getting User By Id',
  security: [{ JWT: [] }],
}

export const DeleteSchema: FastifySchema = {
  querystring: GetByIdValidation,
  tags: [tags.Users],
  summary: 'User Deleting Operation',
  security: [{ JWT: [] }],
}

export const UpdateAvatarValidation = {
  type: 'object',
  properties: {
    encodedAvatar: {
      type: 'string',
    },
  },
} as const satisfies JSONSchema

export const UpdateAvatarSchema = {
  body: UpdateAvatarValidation,
  tags: [tags.Users],
  summary: 'Updating Avatar of User',
  description: 'Valid format of encodedAvatar\n\n\tdata:image/"extension";base64,"base64string"',
  security: [{ JWT: [] }],
} as FastifySchema
