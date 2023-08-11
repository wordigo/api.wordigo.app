import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'
import { TypesOfPublics } from './dictionaries.types'
import { FastifySchema } from 'fastify'

export const GetUserDictionariesSchema = {
  tags: [tags.Dictionaries],
  summary: 'Get User Dictionaries',
  security: [{ JWT: [] }],
}

export const GetDictionaryBySlugValidation = {
  type: 'object',
  properties: {
    slug: {
      type: 'string',
    },
  },
  required: ['slug'],
} as const satisfies JSONSchema

export const GetDictionaryValidation = {
  type: 'object',
  properties: {
    slug: {
      type: 'string',
    },
  },
  required: ['slug'],
} as const satisfies JSONSchema

export const GetUserDictionaryBySlugSchema = {
  querystring: GetDictionaryBySlugValidation,
  tags: [tags.Dictionaries],
  summary: "Getting User's Dictionary By Slug",
  security: [{ JWT: [] }],
}

export const DeleteDictionarySchema = {
  querystring: GetDictionaryBySlugValidation,
  tags: [tags.Dictionaries],
  summary: 'Delete Operation of Dictionary',
  security: [{ JWT: [] }],
} as FastifySchema

export const CreateDictionaryValidation = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    sourceLang: {
      type: 'string',
    },
    targetLang: {
      type: 'string',
    },
  },
  required: ['title'],
} as const satisfies JSONSchema

export const CreateDictionarySchema = {
  body: CreateDictionaryValidation,
  tags: [tags.Dictionaries],
  summary: 'Create Operation of Dictionary',
  security: [{ JWT: [] }],
} as FastifySchema

export const UpdateDictionaryValidation = {
  type: 'object',
  properties: {
    slug: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    level: {
      type: 'number',
    },
    rate: {
      type: 'number',
    },
    published: {
      type: 'boolean',
    },
    sourceLang: {
      type: 'string',
    },
    targetLang: {
      type: 'string',
    },
  },
  required: ['slug'],
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
    slug: {
      type: 'string',
    },
    wordId: {
      type: 'number',
    },
  },
  required: ['slug', 'wordId'],
} as const satisfies JSONSchema

export const AddWordSchema = {
  body: AddWordValidation,
  tags: [tags.Dictionaries],
  summary: 'Adding Word From Dictionary',
  security: [{ JWT: [] }],
} as FastifySchema

export const RemoveWordValidation = {
  type: 'object',
  properties: {
    slug: {
      type: 'string',
    },
    wordId: {
      type: 'number',
    },
  },
  required: ['slug', 'wordId'],
} as const satisfies JSONSchema

export const RemoveWordSchema = {
  body: RemoveWordValidation,
  tags: [tags.Dictionaries],
  summary: 'Removing Word From Dictionary',
  security: [{ JWT: [] }],
}

export const GetWordsSchema = {
  querystring: GetDictionaryValidation,
  tags: [tags.Dictionaries],
  summary: 'Get Words of Dictionary',
  security: [{ JWT: [] }],
}

export const SubscribeSchema = {
  querystring: GetDictionaryBySlugValidation,
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
  querystring: GetDictionaryBySlugValidation,
  tags: [tags.Dictionaries],
  summary: 'Unsubscribe from Dictionary',
  security: [{ JWT: [] }],
} as FastifySchema

export const UpdateImageValidation = {
  type: 'object',
  properties: {
    dictionaryId: {
      type: 'number',
    },
    encodedImage: {
      type: 'string',
    },
  },
} as const satisfies JSONSchema

export const UpdateImageSchema = {
  body: UpdateImageValidation,
  tags: [tags.Dictionaries],
  summary: 'Updating Image of Dictionary',
  description: 'Valid format of encodedImage\n\n\tdata:image/"extension";base64,"base64string"',
  security: [{ JWT: [] }],
} as FastifySchema
