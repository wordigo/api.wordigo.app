import { FastifySchema } from 'fastify'
import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const GetByIdValidation = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
} as const satisfies JSONSchema

export const UpdateProfileValidation = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
  },
} as const satisfies JSONSchema

export const UpdateProfileSchema: FastifySchema = {
  body: UpdateProfileValidation,
  tags: [tags.Users],
  summary: 'Updating Username of User',
  security: [{ JWT: [] }],
}

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
