import { tags } from '../../utils/constants/Tags'
import { JSONSchema } from 'json-schema-to-ts'

export const SubscriptionValidation = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
  required: ['email'],
} as const satisfies JSONSchema

export const SubscriptionSchema = {
  querystring: SubscriptionValidation,
  tags: [tags.UserSubscription],
  description: 'Subscription',
}

export const SubscribersSchema = {
  tags: [tags.UserSubscription],
  description: 'Subscribers',
  security: [{ JWT: [] }],
}
