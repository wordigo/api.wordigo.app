import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'

export const CreateFeedBackValidation = {
  type: 'object',
  properties: {
    description: {
      type: 'string'
    },
    rate: {
      type: 'number',
      default: 5,
      maximum: 5,
      minimum: 1,
    },
  },
  required: ['description', 'rate'],
} as const satisfies JSONSchema

export const CreateFeedbackSchema = {
  body: CreateFeedBackValidation,
  tags: [tags.General],
  summary: 'Send Feedback',
  security: [{ JWT: [] }],
}

export const GetAllFeedbackSchema = {
  tags: [tags.General],
  summary: 'Get All Feedbacks',
  security: [{ JWT: [] }],
}