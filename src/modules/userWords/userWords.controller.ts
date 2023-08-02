import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { DeleteValidation } from './userWords.schema'
import { FromSchema } from 'json-schema-to-ts'

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
      errorResult(null, messages.userWord_not_found, messages.userWord_not_found_code)
    )
  }

  await prisma.userWords.delete({
    where: {
      id: userWord.id,
    },
  })

  return reply.send(successResult(null, messages.success, messages.success_code))
}
