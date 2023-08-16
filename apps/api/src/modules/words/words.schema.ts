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
