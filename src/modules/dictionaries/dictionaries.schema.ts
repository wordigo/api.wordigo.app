import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'
import { TypesOfPublics } from './dictionaries.types'
import { FastifySchema } from 'fastify'

export const GetUserDictionariesSchema = {
  tags: [tags.Dictionaries],
  summary: 'Get User Dictionaries',
  security: [{ JWT: [] }],
}

export const GetDictionaryByIdValidation = {
  type: 'object',
  properties: {
    dictionaryId: {
      type: 'number',
    },
  },
  required: ['dictionaryId'],
} as const satisfies JSONSchema

export const GetUserDictionaryByIdSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  summary: "Getting User's Dictionary By Id",
  security: [{ JWT: [] }],
}

export const DeleteDictionarySchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  summary: 'Delete Operation of Dictionary',
  security: [{ JWT: [] }],
}

export const CreateDictionaryValidation = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    published: {
      type: 'boolean',
    },
  },
  required: ['title', 'published'],
} as const satisfies JSONSchema

export const CreateDictionarySchema = {
  body: CreateDictionaryValidation,
  tags: [tags.Dictionaries],
  summary: 'Create Operation of Dictionary',
  security: [{ JWT: [] }],
}

export const UpdateDictionaryValidation = {
  type: 'object',
  properties: {
    dictionaryId: {
      type: 'number',
    },
    title: {
      type: 'string',
    },
    published: {
      type: 'boolean',
    },
  },
  required: ['dictionaryId', 'title', 'published'],
} as const satisfies JSONSchema

export const UpdateDictionarySchema = {
  body: UpdateDictionaryValidation,
  tags: [tags.Dictionaries],
  summary: 'Update Operation of Dictionary',
  security: [{ JWT: [] }],
}

export const AddWordValidation = {
  type: 'object',
  properties: {
    dictionaryId: {
      type: 'number',
    },
    wordId: {
      type: 'number',
    },
  },
  required: ['dictionaryId', 'wordId'],
} as const satisfies JSONSchema

export const AddWordSchema = {
  body: AddWordValidation,
  tags: [tags.Dictionaries],
  summary: 'Adding Word From Dictionary',
  security: [{ JWT: [] }],
}

export const RemoveWordValidation = {
  type: 'object',
  properties: {
    dictionaryId: {
      type: 'number',
    },
    wordId: {
      type: 'number',
    },
  },
  required: ['dictionaryId', 'wordId'],
} as const satisfies JSONSchema

export const RemoveWordSchema = {
  body: RemoveWordValidation,
  tags: [tags.Dictionaries],
  summary: 'Removing Word From Dictionary',
  security: [{ JWT: [] }],
}

export const GetWordsSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  summary: 'Get Words of Dictionary',
  security: [{ JWT: [] }],
}

export const SubscribeSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  summary: 'Subscription',
  security: [{ JWT: [] }],
}

export const GetPublicDictionariesValidation = {
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

export const GetPublicDictionariesSchema = {
  querystring: GetPublicDictionariesValidation,
  tags: [tags.Dictionaries],
  summary: 'Getting Public Dictionaries',
  security: [{ JWT: [] }],
} as FastifySchema

export const GetListSchema = {
  tags: [tags.Dictionaries],
  summary: 'Getting List of Dictionary',
  security: [{ JWT: [] }],
} as FastifySchema

export const UnsubscribeSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  summary: 'Unsubscribe from Dictionary',
  security: [{ JWT: [] }],
} as FastifySchema
