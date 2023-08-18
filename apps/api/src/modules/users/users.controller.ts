import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { GetByIdValidation, UpdateAvatarValidation } from './users.schema'
import { FromSchema } from 'json-schema-to-ts'
import { UploadingType, uploadImage } from '@/utils/helpers/fileUploading'
import i18next from 'i18next'

type GetByIdType = FromSchema<typeof GetByIdValidation>
type UpdateAvatarType = FromSchema<typeof UpdateAvatarValidation>

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
  const prisma = req.server.prisma

  const resultOfUploading: UploadingType = uploadImage('user', user.username as string, encodedAvatar as string)
  if (!resultOfUploading.success) {
    return reply.send(errorResult(null, i18next.t(messages.uploading_file)))
  }

  const avatar_url = resultOfUploading.url

  await prisma.users.update({ data: { avatar_url }, where: { id: user.id } })

  if (resultOfUploading) {
    return reply.send(successResult({ avatar_url }, i18next.t(messages.success)))
  }
}