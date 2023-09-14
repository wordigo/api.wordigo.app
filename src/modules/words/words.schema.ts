import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const CreateValidation = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
    },
    translatedText: {
      type: 'string',
    },
    nativeLanguage: {
      type: 'string',
    },
    targetLanguage: {
      type: 'string',
    },
    dictionaryId: {
      type: 'number',
    },
  },
  required: ['text', 'translatedText', 'nativeLanguage', 'targetLanguage'],
} as const satisfies JSONSchema

export const CreateSchema = {
  body: CreateValidation,
  tags: [tags.Words],
  summary: 'Creation Operation of Word',
  security: [{ JWT: [] }],
}

export const GetListSchema = {
  tags: [tags.Words],
  summary: 'Creation Operation of Word',
}

export const DeleteValidation = {
  type: 'object',
  properties: {
    wordId: {
      type: 'number',
    },
  },
  required: ['wordId'],
} as const satisfies JSONSchema

export const DeleteSchema = {
  querystring: DeleteValidation,
  tags: [tags.Words],
  description: 'Deleting Word From Her/His Dictionary',
  security: [{ JWT: [] }],
}
