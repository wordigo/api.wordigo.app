import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const DeleteValidation = {
  type: 'object',
  properties: {
    wordId: {
      type: 'number',
    },
  },
  required: ['number'],
} as const satisfies JSONSchema

export const DeleteSchema = {
  querystring: DeleteValidation,
  tags: [tags.UserWords],
  description: 'Deleting Word From Her/His Dictionary',
  security: [{ JWT: [] }],
}
