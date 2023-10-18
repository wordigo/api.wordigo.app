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

  const {
    page = 1,
    size = 10,
    search,
    rate,
    level,
    sourceLang,
    targetLang,
    fromNumOfWords,
    toNumOfWords,
    fromDate,
    toDate
  } = req.query


  const filters = [
    {
      condition: search && search.length > 0,
      filter: { contains: search?.trim().toLowerCase() },
    },
    {
      condition: rate && rate > 0,
      filter: { rate },
    },
    {
      condition: level && level > 0,
      filter: { level },
    },
    {
      condition: sourceLang && sourceLang.length > 0,
      filter: { sourceLang },
    },
    {
      condition: targetLang && targetLang.length > 0,
      filter: { targetLang },
    },
    {
      condition: fromDate && fromDate.length > 0,
      filter: { createdDate: { gte: new Date(fromDate as string) } }
    },
    {
      condition: toDate && toDate.length > 0,
      filter: { createdDate: { lte: new Date(toDate as string) } }
    }
  ]

  const where: any = filters.reduce((where, filter) => {
    if (filter.condition) {
      return { ...where, ...filter.filter }
    }
    return where
  }, { published: true })

  let publicDics = await prisma.dictionaries.findMany({
    where,
    include: { author: { select: { name: true, avatar_url: true } }, UserWords: { include: { userWord: { include: { word: true } } } } },
    //skip: (page - 1) * size,
    //take: size
  })

  publicDics = publicDics.filter(dic => {
    if (toNumOfWords && toNumOfWords as number > 0 && fromNumOfWords && fromNumOfWords as number > 0)
      return dic.UserWords.length < (toNumOfWords as number) && dic.UserWords.length > (fromNumOfWords as number)

    else if (fromNumOfWords && fromNumOfWords > 0)
      return dic.UserWords.length > fromNumOfWords

    else if (toNumOfWords && toNumOfWords > 0)
      return dic.UserWords.length < toNumOfWords

    else
      return true
  })

  const numberOfDics = publicDics.length

  publicDics = publicDics
    .slice((page - 1) * size) //skip
    .slice(0, size) //take
    .sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime()) //sort

  const result = publicDics.map((dic) => {
    let numberOfWords = dic.UserWords.length

    //@ts-ignore
    delete dic.UserWords

    return { ...dic, numberOfWords }
  })

  const pagination: PaginationType = {
    page,
    size,
    totalPage: Math.ceil(numberOfDics / size),
    totalCount: numberOfDics,
  }

  return reply.send(successPaginationResult(result, pagination, i18next.t(messages.success)))
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
