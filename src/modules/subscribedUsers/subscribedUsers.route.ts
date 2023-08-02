import { FastifyInstance } from 'fastify'
import { Subscribers, Subscription } from './subscribedUsers.controller'
import { SubscribersSchema, SubscriptionSchema } from './subscribedUsers.schema'

export default async (fastify: FastifyInstance) => {
  fastify.post('/subscription', { schema: SubscriptionSchema }, Subscription)

  fastify.get('/subscribers', { schema: SubscribersSchema, preValidation: fastify.authVerify }, Subscribers)
}
