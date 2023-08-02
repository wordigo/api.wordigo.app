import { tags } from '../../utils/constants/Tags'
import { JSONSchema } from 'json-schema-to-ts'

export const SubscriptionValidation = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
  },
  required: ['email'],
} as const satisfies JSONSchema

export const SubscriptionSchema = {
  querystring: SubscriptionValidation,
  tags: [tags.Subscription],
  description: 'Subscription',
}

export const SubscribersSchema = {
  tags: [tags.Subscription],
  description: 'Subscribers',
  security: [{ JWT: [] }],
}
