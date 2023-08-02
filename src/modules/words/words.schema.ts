import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const CreateWordValidation = {
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

export const CreateWordSchema = {
  body: CreateWordValidation,
  tags: [tags.Words],
  description: 'Creation Operation of Word',
  security: [{ JWT: [] }],
}
