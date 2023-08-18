import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { DeleteValidation } from './userWords.schema'
import { FromSchema } from 'json-schema-to-ts'
import i18next from 'i18next'

type GetDictionaryByIdType = FromSchema<typeof DeleteValidation>

export const Delete = async (
  req: FastifyRequest<{ Querystring: GetDictionaryByIdType }>,
  reply: FastifyReply
) => {
  const userId = req.user?.id
  const { wordId } = req.query
  const prisma = req.server.prisma

  const userWord = await prisma.userWords.findFirst({
    where: {
      wordId,
      authorId: userId,
    },
  })

  if (!userWord) {
    return reply.send(
      errorResult(null, i18next.t(messages.userWord_not_found))
    )
  }

  await prisma.userWords.delete({
    where: {
      id: userWord.id,
    },
  })

  return reply.send(successResult(null, i18next.t(messages.success)))
}
