import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { successResult } from '@/utils/constants/results'
import { GetUserDictionaryByIdValidationSchema } from './dictionaries.schema'
import { FromSchema } from 'json-schema-to-ts'

type GetUserDictionaryByIdSchemaType = FromSchema<typeof GetUserDictionaryByIdValidationSchema>

export const GetUserDictionaries = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user?.id
  const prisma = request.server.prisma

  const userDictionaries = await prisma.dictionaries.findMany({
    where: {
      authorId: userId,
    },
  })

  return reply.send(successResult(userDictionaries, messages.success, messages.success_code))
}

export const GetUserDictionaryById = async (
  request: FastifyRequest<{ Querystring: GetUserDictionaryByIdSchemaType }>,
  reply: FastifyReply
) => {
  const { dictionaryId } = request.query
  const prisma = request.server.prisma

  const userDictionaries = await prisma.dictionaries.findMany({
    where: {
      authorId: request.user?.id,
      id: dictionaryId,
    },
  })

  return reply.send(successResult(userDictionaries, messages.success, messages.success_code))
}

export const Create = (request: FastifyRequest, reply: FastifyReply) => {
  return reply.send(successResult(request.user, messages.success, messages.success_code))
}

export const Update = (request: FastifyRequest, reply: FastifyReply) => {
  return reply.send(successResult(request.user, messages.success, messages.success_code))
}

export const Delete = (request: FastifyRequest, reply: FastifyReply) => {
  return reply.send(successResult(request.user, messages.success, messages.success_code))
}
