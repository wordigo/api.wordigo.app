import { tags } from '@/utils/constants/Tags'
import { JSONSchema } from 'json-schema-to-ts'

export const TranslationValidationBody = {
  type: 'object',
  properties: {
    sourceLanguage: {
      type: 'string',
      default: 'auto',
    },
    targetLanguage: {
      type: 'string',
      default: 'tr',
    },
    query: {
      type: 'string',
      default: 'Hello World',
    },
  },
  required: ['query', 'targetLanguage', 'sourceLanguage'],
} as const satisfies JSONSchema

export const TranslationValidation = {
  body: TranslationValidationBody,
  tags: [tags.Translate],
  description: 'Translate request endpoint',
}
