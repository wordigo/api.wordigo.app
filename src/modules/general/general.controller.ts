import { FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'

import messages from '@//utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { prisma } from '@/lib/prisma'
import { FromSchema } from 'json-schema-to-ts'
import { CreateFeedBackValidation } from './general.schema'

type CreateFeedBackType = FromSchema<typeof CreateFeedBackValidation>

export const CreateFeedback = async (req: FastifyRequest<{ Body: CreateFeedBackType }>, reply: FastifyReply) => {
  const user = req.user
  const { description, rate } = req.body

  const feedback = await prisma.feedbacks.create({
    data: {
      userId: user.id,
      description,
      rate
    }
  })

  return reply.send(successResult(feedback, i18next.t(messages.success)))
}

export const GetAllFeedback = async (req: FastifyRequest, reply: FastifyReply) => {

  const feedbacks = await prisma.feedbacks.findMany()

  return reply.send(successResult(feedbacks, i18next.t(messages.success)))
}