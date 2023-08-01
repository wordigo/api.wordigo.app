import { FastifySchema } from 'fastify'
import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const GetUserDictionariesSchema = {
  tags: [tags.Dictionaries],
  description: 'Get User Dictionaries',
  security: [{ JWT: [] }],
}

export const GetUserDictionaryByIdValidationSchema = {
  type: 'object',
  properties: {
    dictionaryId: {
      type: 'number',
    },
  },
  required: ['dictionaryId'],
} as const satisfies JSONSchema

export const GetUserDictionaryByIdSchema = {
  query: GetUserDictionaryByIdValidationSchema,
  tags: [tags.Dictionaries],
  description: 'Get User Dictionary By Id',
  security: [{ JWT: [] }],
}
