import { LearningStatuses } from '@/utils/constants/enums'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'
import { FromSchema } from 'json-schema-to-ts'
import slugify from 'slugify'
import { DictionaryInitialTitle } from '../dictionaries/dictionaries.types'
import { checkingOfLanguages } from '../translation/translate.service'
import { CreateValidation, DeleteValidation } from './words.schema'
import { create } from './words.service'

type CreateType = FromSchema<typeof CreateValidation>
type GetDictionaryByIdType = FromSchema<typeof DeleteValidation>

export const Create = async (req: FastifyRequest<{ Body: CreateType }>, reply: FastifyReply) => {
  const { text, translatedText, nativeLanguage, targetLanguage, dictionaryId } = req.body
  const userId = req.user?.id
  const prisma = req.server.prisma

  return reply.send(await create(text, translatedText, nativeLanguage, targetLanguage, dictionaryId as number, userId))
}

export const Delete = async (req: FastifyRequest<{ Querystring: GetDictionaryByIdType }>, reply: FastifyReply) => {
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
    return reply.send(errorResult(null, i18next.t(messages.userWord_not_found)))
  }

  await prisma.userWords.delete({
    where: {
      id: userWord.id,
    },
  })

  return reply.send(successResult(null, i18next.t(messages.success)))
}

export const GetList = async (req: FastifyRequest, reply: FastifyReply) => {
  const prisma = req.server.prisma

  const words = await prisma.words.findMany()

  return reply.send(successResult(words, i18next.t(messages.success)))
}
