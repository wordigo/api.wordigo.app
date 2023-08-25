import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { GetByIdValidation, UpdateAvatarValidation, UpdateUsernameValidation } from './users.schema'
import { FromSchema } from 'json-schema-to-ts'
import i18next from 'i18next'
import { Update } from './users.service'

type GetByIdType = FromSchema<typeof GetByIdValidation>
type UpdateAvatarType = FromSchema<typeof UpdateAvatarValidation>
type UpdateUsernameType = FromSchema<typeof UpdateUsernameValidation>

export const GetMe = async (req: FastifyRequest, reply: FastifyReply) => {
  return reply.send(successResult(req.user, i18next.t(messages.success)))
}

export const GetById = async (req: FastifyRequest<{ Querystring: GetByIdType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const { id } = req.query

  const user = await prisma.users.findFirst({ where: { id } })

  if (!user) return reply.send(errorResult(null, i18next.t(messages.user_not_found)))

  return reply.send(successResult(user, i18next.t(messages.success)))
}

export const Delete = async (req: FastifyRequest<{ Querystring: GetByIdType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const { id } = req.query

  const user = await prisma.users.findFirst({ where: { id } })

  if (!user) return reply.send(errorResult(null, i18next.t(messages.user_not_found)))

  await prisma.users.delete({
    where: {
      id,
    },
  })

  return reply.send(successResult(null, i18next.t(messages.success)))
}

export const UpdateAvatar = async (req: FastifyRequest<{ Body: UpdateAvatarType }>, reply: FastifyReply) => {
  const user = req.user
  const { encodedAvatar } = req.body

  const result = await Update({ user, base64Avatar: encodedAvatar })

  if (!result.success) {
    return errorResult(null, i18next.t(result.message))
  }

  return successResult(result.data, i18next.t(result.message))
}

export const UpdateUsername = async (req: FastifyRequest<{ Querystring: UpdateUsernameType }>, reply: FastifyReply) => {
  const user = req.user
  const { username } = req.query

  const result = await Update({ user, username })

  if (!result.success) {
    return errorResult(null, i18next.t(result.message))
  }

  return successResult(result.data, i18next.t(result.message))
}
