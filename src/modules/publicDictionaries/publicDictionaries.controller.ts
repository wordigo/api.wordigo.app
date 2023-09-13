import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import messages from '@/utils/constants/messages'
import { PaginationType, errorResult, successPaginationResult, successResult } from '@/utils/constants/results'
import { GetPublicDictionariesValidation } from './publicDictionaries.schema'
import i18next from 'i18next'
import { GetDictionaryBySlugValidation } from '../dictionaries/dictionaries.schema'
import { log } from 'console'
import { Words } from '@prisma/client'

type GetPublicDictionariesType = FromSchema<typeof GetPublicDictionariesValidation>
type GetDictionaryBySlugType = FromSchema<typeof GetDictionaryBySlugValidation>

export const GetPublicDictionaries = async (req: FastifyRequest<{ Querystring: GetPublicDictionariesType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma

  const { page = 1, size = 10 } = req.query

  const publicDics = await prisma.dictionaries.findMany({
    where: {
      published: true,
    },
    include: { author: { select: { name: true, avatar_url: true } } },
    skip: (page - 1) * size,
    take: size,
  })

  const numberOfPublicDics = await prisma.dictionaries.count({
    where: {
      published: true,
    },
  })

  const pagination: PaginationType = {
    page,
    size,
    totalPage: Math.ceil(numberOfPublicDics / size),
    totalCount: numberOfPublicDics,
  }

  return reply.send(successPaginationResult(publicDics, pagination, i18next.t(messages.success)))
}

export const GetPublicDictionaryBySlug = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma

  const { slug } = req.query

  let dictionary = await prisma.dictionaries.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          avatar_url: true,
        },
      },
      UserWords: {
        include: {
          userWord: {
            include: {
              word: true,
            },
          },
        },
      },
    },
  })

  if (dictionary) {
    //@ts-ignore
    delete dictionary?.authorId

    let words = [] as Words[]
    dictionary?.UserWords.map((w) => words.push(w.userWord.word))

    //@ts-ignore
    delete dictionary.UserWords

    //@ts-ignore
    dictionary = { ...dictionary, words }
  }

  if (!dictionary) return reply.send(errorResult(dictionary, i18next.t(messages.dictionary_not_found)))

  return reply.send(successResult(dictionary, i18next.t(messages.success)))
}

export const Subscribe = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const { slug } = req.query
  const userId = req.user?.id
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: {
      slug,
    },
  })

  if (!dictionary) return errorResult(null, i18next.t(messages.dictionary_not_found))

  if (dictionary.authorId === userId) return errorResult(null, i18next.t(messages.subscription_own_dic))

  const subscribedDics = await prisma.subscribedDics.findFirst({
    where: {
      userId,
      dictionaryId: dictionary.id,
    },
  })

  if (subscribedDics) return errorResult(null, i18next.t(messages.dictionary_already_subscribed))

  await prisma.subscribedDics.create({
    data: {
      dictionaryId: dictionary.id,
      userId: userId as string,
    },
  })

  return successResult(null, i18next.t(messages.success))
}

export const Unsubscribe = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const { slug } = req.query
  const userId = req.user?.id
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({ where: { slug } })
  if (!dictionary) return reply.send(errorResult(null, i18next.t(messages.dictionary_not_found)))

  const subbedDics = await prisma.subscribedDics.findFirst({
    where: {
      userId,
      dictionaryId: dictionary.id,
    },
  })

  if (!subbedDics) return reply.send(errorResult(null, i18next.t(messages.dictionary_not_found)))

  await prisma.subscribedDics.delete({ where: { id: subbedDics.id } })

  return reply.send(successResult(null, i18next.t(messages.success)))
}
