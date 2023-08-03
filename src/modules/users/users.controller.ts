// import { PrismaClient } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { GetUserByIdValidation } from './users.schema'
import { FromSchema } from 'json-schema-to-ts'

type GetUserByIdType = FromSchema<typeof GetUserByIdValidation>

export const GetUserMe = async (req: FastifyRequest, reply: FastifyReply) => {
  return reply.send(successResult(req.user, messages.success, messages.success_code))
}

export const GetUserById = async (req: FastifyRequest<{ Querystring: GetUserByIdType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const { id } = req.query

  const user = await prisma.users.findFirst({ where: { id } })

  if (!user) return reply.send(errorResult(null, messages.user_not_found, messages.user_not_found_code))

  return reply.send(successResult(user, messages.success, messages.success_code))
}
