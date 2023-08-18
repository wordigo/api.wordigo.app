import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { SubscriptionValidation } from './subscribedUsers.schema'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import i18next from 'i18next'

type SubscriptionValidationType = FromSchema<typeof SubscriptionValidation>

export async function Subscription(req: FastifyRequest<{ Querystring: SubscriptionValidationType }>, reply: FastifyReply) {
  const { email } = req.query
  const prisma = req.server.prisma

  const subscribedUser = await prisma.subscribedUsers.findFirst({
    where: {
      email: email.trim().toLowerCase(),
    },
  })

  if (subscribedUser) return reply.send(errorResult(null, i18next.t(messages.user_already_subscribed)))

  await prisma.subscribedUsers.create({
    data: {
      email: email.trim().toLowerCase(),
    },
  })

  return reply.send(successResult(null, i18next.t(messages.success)))
}

export async function Subscribers(req: FastifyRequest, reply: FastifyReply) {
  const prisma = req.server.prisma

  const subs = await prisma.subscribedUsers.findMany()

  return reply.send(successResult(subs, i18next.t(messages.success)))
}
