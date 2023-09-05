import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'
import { FastifySchema } from 'fastify'

export const GetDictionaryByIdValidation = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
} as const satisfies JSONSchema

export const GetUserDictionaryByIdSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.PublicDictionaries],
  summary: 'Getting Public Dictionary By Id',
}

export const GetPublicDictionariesValidation = {
  type: 'object',
  properties: {
    page: {
      type: 'number',
      default: 1,
    },
    size: {
      type: 'number',
      default: 10,
    },
  },
  required: ['page', 'size'],
} as const satisfies JSONSchema

export const GetPublicDictionariesSchema = {
  querystring: GetPublicDictionariesValidation,
  tags: [tags.PublicDictionaries],
  summary: 'Getting Public Dictionaries',
} as FastifySchema
