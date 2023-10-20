import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'
import { FastifySchema } from 'fastify'
import { GetDictionaryBySlugValidation } from '../dictionaries/dictionaries.schema'
import { TypesOfPublics } from '../dictionaries/dictionaries.types'

export const GetUserDictionaryBySlugSchema = {
  querystring: GetDictionaryBySlugValidation,
  tags: [tags.PublicDictionaries],
  summary: 'Getting Public Dictionary By Slug',
  security: [{ JWT: [] }],
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
      default: 30,
    },
    search: {
      type: 'string',
    },
    rate: {
      type: 'number'
    },
    level: {
      type: 'number',
      description: 'Restrictions are according to A1, A2, B1, B2, C1 and C2 levels (1-6 are allowed!)'
    },
    sourceLang: {
      type: 'string',
    },
    targetLang: {
      type: 'string',
    },
    fromDate: {
      type: 'string',
    },
    toDate: {
      type: 'string',
    },
    fromNumOfWords: {
      type: 'number'
    },
    toNumOfWords: {
      type: 'number'
    }
  },
  required: ['page', 'size'],
} as const satisfies JSONSchema

export const GetPublicDictionariesSchema = {
  querystring: GetPublicDictionariesValidation,
  tags: [tags.PublicDictionaries],
  summary: 'Getting Public Dictionaries',
} as FastifySchema

export const SubscribeSchema = {
  querystring: GetDictionaryBySlugValidation,
  tags: [tags.PublicDictionaries],
  summary: 'Subscription',
  security: [{ JWT: [] }],
}
export const UnsubscribeSchema = {
  querystring: GetDictionaryBySlugValidation,
  tags: [tags.PublicDictionaries],
  summary: 'Unsubscribe from Dictionary',
  security: [{ JWT: [] }],
} as FastifySchema

export const GetUserPublicDictionariesValidation = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      default: TypesOfPublics.All,
      description: 'Valid Types \n all, subscribed, notSubscribed',
    },
  },
  required: ['type'],
} as const satisfies JSONSchema

export const GetUserPublicDictionariesSchema = {
  querystring: GetUserPublicDictionariesValidation,
  tags: [tags.PublicDictionaries],
  summary: 'Getting Public Dictionaries According to User',
  security: [{ JWT: [] }],
} as FastifySchema
