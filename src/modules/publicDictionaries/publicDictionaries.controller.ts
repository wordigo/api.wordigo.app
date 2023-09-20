import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import messages from '@/utils/constants/messages'
import { PaginationType, errorResult, successPaginationResult, successResult } from '@/utils/constants/results'
import { GetPublicDictionariesValidation, GetUserPublicDictionariesValidation } from './publicDictionaries.schema'
import i18next from 'i18next'
import { GetDictionaryBySlugValidation } from '../dictionaries/dictionaries.schema'
import { Words } from '@prisma/client'
import { TypesOfPublics } from '../dictionaries/dictionaries.types'

type GetPublicDictionariesType = FromSchema<typeof GetPublicDictionariesValidation>
type GetDictionaryBySlugType = FromSchema<typeof GetDictionaryBySlugValidation>
type GetUserPublicDictionariesType = FromSchema<typeof GetUserPublicDictionariesValidation>

export const GetPublicDictionaries = async (req: FastifyRequest<{ Querystring: GetPublicDictionariesType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma

  const { page = 1, size = 10, search } = req.query

  let where: any = { published: true }

  if (search && search.length > 0) {
    const title = { contains: search.trim().toLowerCase() }
    where = { ...where, title }
  }

  const publicDics = await prisma.dictionaries.findMany({
    where,
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

export const GetUserPublicDictionaries = async (req: FastifyRequest<{ Querystring: GetUserPublicDictionariesType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const userId = req.user.id
  const { type } = req.query

  let publicDics

  switch (type) {
    case TypesOfPublics.All:
      publicDics = await prisma.dictionaries.findMany({
        where: {
          published: true,
          NOT: { authorId: userId },
        },
      })
      break
    case TypesOfPublics.Subscribed:
      publicDics = await prisma.subscribedDics.findMany({
        where: {
          userId,
        },
        include: {
          Dictionary: true,
        },
      })
      break
    case TypesOfPublics.NotSubscribed:
      const subscribedDics = await prisma.subscribedDics.findMany({
        where: {
          userId,
        },
      })
      console.log(subscribedDics)
      publicDics = await prisma.dictionaries.findMany({
        where: {
          NOT: { authorId: userId },
          id: { notIn: subscribedDics.length === 0 ? [] : subscribedDics.map((dic) => dic.dictionaryId) },
          published: true,
        },
      })
      break
    default:
      return reply.send(errorResult(null, i18next.t(messages.dictionary_invalid_type)))
  }

  return reply.send(successResult(publicDics, i18next.t(messages.success)))
}
