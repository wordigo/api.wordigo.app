// import { PrismaClient } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { GetByIdValidation, UpdateAvatarValidation } from './users.schema'
import { FromSchema } from 'json-schema-to-ts'
import { UploadingType, uploadImage } from '@/utils/helpers/fileUploading'

type GetByIdType = FromSchema<typeof GetByIdValidation>
type UpdateAvatarType = FromSchema<typeof UpdateAvatarValidation>

export const GetMe = async (req: FastifyRequest, reply: FastifyReply) => {
  return reply.send(successResult(req.user, messages.success, messages.success_code))
}

export const GetById = async (req: FastifyRequest<{ Querystring: GetByIdType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const { id } = req.query

  const user = await prisma.users.findFirst({ where: { id } })

  if (!user) return reply.send(errorResult(null, messages.user_not_found, messages.user_not_found_code))

  return reply.send(successResult(user, messages.success, messages.success_code))
}

export const Delete = async (req: FastifyRequest<{ Querystring: GetByIdType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const { id } = req.query

  const user = await prisma.users.findFirst({ where: { id } })

  if (!user) return reply.send(errorResult(null, messages.user_not_found, messages.user_not_found_code))

  await prisma.users.delete({
    where: {
      id,
    },
  })

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export const UpdateAvatar = async (req: FastifyRequest<{ Body: UpdateAvatarType }>, reply: FastifyReply) => {
  const user = req.user
  const { encodedAvatar } = req.body
  const prisma = req.server.prisma

  const resultOfUploading: UploadingType = uploadImage('user', user.username as string, encodedAvatar as string)
  if (!resultOfUploading.success) {
    return reply.send(errorResult(null, messages.uploading_file, messages.uploading_file_code))
  }

  const avatar_url = resultOfUploading.url

  await prisma.users.update({ data: { avatar_url }, where: { id: user.id } })

  if (resultOfUploading) {
    return reply.send(successResult({ avatar_url }, messages.success, messages.success_code))
  }
}
