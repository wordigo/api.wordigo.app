import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const GetUserDictionariesSchema = {
  tags: [tags.Dictionaries],
  description: 'Get User Dictionaries',
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
  description: "Getting User's Dictionary By Id",
  security: [{ JWT: [] }],
}

export const DeleteDictionarySchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  description: 'Delete Operation of Dictionary',
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
  description: 'Create Operation of Dictionary',
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
  description: 'Update Operation of Dictionary',
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
  description: 'Adding Word From Dictionary',
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
  description: 'Removing Word From Dictionary',
  security: [{ JWT: [] }],
}

export const GetWordsSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  description: 'Get Words of Dictionary',
  security: [{ JWT: [] }],
}

export const SubscribeSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  description: 'Subscription',
  security: [{ JWT: [] }],
}

export const GetSubscribedListSchema = {
  querystring: GetDictionaryByIdValidation,
  tags: [tags.Dictionaries],
  description: 'Getting Subscribed Dictionaries',
  security: [{ JWT: [] }],
}
