import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const GetUserDictionariesSchema = {
  tags: [tags.Dictionaries],
  description: 'Get User Dictionaries',
  security: [{ JWT: [] }],
}

export const GetDictionaryByIdValidationSchema = {
  type: 'object',
  properties: {
    dictionaryId: {
      type: 'number',
    },
  },
  required: ['dictionaryId'],
} as const satisfies JSONSchema

export const GetUserDictionaryByIdSchema = {
  query: GetDictionaryByIdValidationSchema,
  tags: [tags.Dictionaries],
  description: "Getting User's Dictionary By Id",
  security: [{ JWT: [] }],
}

export const DeleteDictionarySchema = {
  querystring: GetDictionaryByIdValidationSchema,
  tags: [tags.Dictionaries],
  description: 'Delete Operation of Dictionary',
  security: [{ JWT: [] }],
}

export const CreateDictionaryValidationSchema = {
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
  body: CreateDictionaryValidationSchema,
  tags: [tags.Dictionaries],
  description: 'Create Operation of Dictionary',
  security: [{ JWT: [] }],
}

export const UpdateDictionaryValidationSchema = {
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
  body: UpdateDictionaryValidationSchema,
  tags: [tags.Dictionaries],
  description: 'Update Operation of Dictionary',
  security: [{ JWT: [] }],
}

export const AddWordValidationSchema = {
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
  body: AddWordValidationSchema,
  tags: [tags.Dictionaries],
  description: 'Adding Word From Dictionary',
  security: [{ JWT: [] }],
}

export const RemoveWordValidationSchema = {
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
  body: RemoveWordValidationSchema,
  tags: [tags.Dictionaries],
  description: 'Removing Word From Dictionary',
  security: [{ JWT: [] }],
}
