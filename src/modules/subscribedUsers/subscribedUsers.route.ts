import { FastifyInstance } from 'fastify'
import { SubscribersSchema, SubscriptionSchema } from './subscribedUsers.schema'
import { Subscription, Subscribers } from './subscribedUsers.controller'
import { authMiddleware } from '@/lib/fastify-passport'

export default async (fastify: FastifyInstance) => {
  fastify.post('/subscription', { schema: SubscriptionSchema }, Subscription)

  fastify.get(
    '/subscribers',
    { schema: SubscribersSchema, preValidation: authMiddleware },
    Subscribers
  )
}
