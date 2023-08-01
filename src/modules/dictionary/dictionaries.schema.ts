import { FastifySchema } from 'fastify'
import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const GetUserDictionariesSchema = {
  tags: [tags.Dictionaries],
  description: 'Get User Dictionaries',
  security: [{ JWT: [] }],
  response: {
    // 200: {
    //   type: "object",
    //   properties: {
    //     results: { type: "array", items: { $ref: "productSchema#" } },
    //   },
    // },
  },
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
  params: GetUserDictionaryByIdValidationSchema,
  tags: [tags.Dictionaries],
  description: 'Get User Dictionary By Id',
  security: [{ JWT: [] }],
}
