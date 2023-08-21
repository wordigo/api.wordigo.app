import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import slugify from 'slugify'

import messages from '@/utils/constants/messages'
import { PaginationType, errorResult, successPaginationResult, successResult } from '@/utils/constants/results'
import {
  AddWordValidation,
  CreateDictionaryValidation,
  GetDictionaryBySlugValidation,
  GetDictionaryValidation,
  GetUserPublicDictionariesValidation,
  RemoveWordValidation,
  UpdateDictionaryValidation,
  UpdateImageValidation,
  GetPublicDictionariesValidation,
} from './dictionaries.schema'
import { TypesOfPublics } from './dictionaries.types'
import { Words } from '@prisma/client'
import { DictionaryInitialTitle } from './dictionaries.types'
import { UploadingType, uploadImage } from '../../utils/helpers/fileUploading'
import { randomUUID } from 'crypto'
import i18next from 'i18next'

type GetDictionaryBySlugType = FromSchema<typeof GetDictionaryBySlugValidation>
type GetDictionaryType = FromSchema<typeof GetDictionaryValidation>
type CreateDictionaryType = FromSchema<typeof CreateDictionaryValidation>
type UpdateDictionaryType = FromSchema<typeof UpdateDictionaryValidation>
type RemoveWordType = FromSchema<typeof RemoveWordValidation>
type AddWordType = FromSchema<typeof AddWordValidation>
type GetUserPublicDictionariesType = FromSchema<typeof GetUserPublicDictionariesValidation>
type UpdateImageValidationType = FromSchema<typeof UpdateImageValidation>
type GetPublicDictionariesValidationType = FromSchema<typeof GetPublicDictionariesValidation>

export const Create = async (req: FastifyRequest<{ Body: CreateDictionaryType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { title, targetLang, sourceLang } = req.body
  const prisma = req.server.prisma

  console.log(title.trim().toLowerCase())
  console.log(DictionaryInitialTitle)
  if (title && title.trim().toLowerCase() === DictionaryInitialTitle) return reply.send(errorResult(null, messages.dictionary_already_exists))

  let slug
  while (true) {
    slug = slugify(`${title}-${randomUUID()}`, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    })

    const doesSlugExist = await prisma.dictionaries.findFirst({ where: { slug } })
    if (!doesSlugExist) break
  }

  const newDictionary = await prisma.dictionaries.create({
    data: {
      title: title.trim().toLowerCase(),
      authorId: userId,
      slug,
      targetLang,
      sourceLang,
    },
  })

  return reply.send(successResult(newDictionary, messages.success))
}

export const Update = async (req: FastifyRequest<{ Body: UpdateDictionaryType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  let { slug, title, published, description, rate, level, targetLang, sourceLang } = req.body
  const prisma = req.server.prisma

  if (title && title.trim().toLowerCase() === DictionaryInitialTitle) return reply.send(errorResult(null, messages.dictionary_already_exists))

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug },
  })

  if (!dictionary) return errorResult(null, messages.dictionary_not_found)

  if (dictionary.title === DictionaryInitialTitle) return reply.send(errorResult(null, messages.dictionary_initial_update))

  const updatedDictionary = await prisma.dictionaries.update({
    where: { id: dictionary.id },
    data: { title, published, rate, description, level, targetLang, sourceLang },
  })

  return reply.send(successResult(updatedDictionary, messages.success))
}

export const Delete = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { slug } = req.query
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug },
  })

  if (!dictionary) {
    return errorResult(null, messages.dictionary_not_found)
  }

  await prisma.dictionaries.delete({
    where: { id: dictionary.id },
  })

  return reply.send(successResult(null, messages.success))
}

export const GetList = async (req: FastifyRequest, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const dictionaries = await prisma.dictionaries.findMany()

  return reply.send(successResult(dictionaries, messages.success))
}

export const GetUserDictionaries = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user?.id
  const prisma = request.server.prisma

  const userDictionaries = await prisma.dictionaries.findMany({
    where: {
      authorId: userId,
    },
    include: {
      UserWords: {
        include: {
          userWord: {
            include: {
              word: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const result = userDictionaries.map((dic) => {
    let numberOfWords = dic.UserWords.length

    //@ts-ignore
    delete dic.UserWords

    return { ...dic, numberOfWords }
  })

  return reply.send(successResult(result, messages.success))
}

export const GetUserDictionaryBySlug = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const { slug } = req.query
  const prisma = req.server.prisma

  const userDictionaries = await prisma.dictionaries.findMany({
    where: {
      authorId: req.user?.id,
      slug,
    },
  })

  return reply.send(successResult(userDictionaries, messages.success))
}

export const RemoveWord = async (req: FastifyRequest<{ Body: RemoveWordType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { wordId, slug } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug: slug as string },
  })

  if (!dictionary) {
    return reply.send(errorResult(null, messages.dictionary_not_found))
  }

  const word = await prisma.words.findFirst({
    where: { id: wordId },
  })

  if (!word) {
    return reply.send(errorResult(null, messages.word_not_found))
  }

  const userWord = await prisma.userWords.findFirst({
    where: { word, authorId: userId },
  })

  if (!userWord) {
    return reply.send(errorResult(null, messages.userWord_not_found))
  }

  await prisma.dictAndUserWords.delete({
    where: { userWordId_dictionaryId: { dictionaryId: dictionary.id, userWordId: userWord.id } },
  })

  return reply.send(successResult(null, messages.success))
}

export const AddWord = async (req: FastifyRequest<{ Body: AddWordType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { wordId, slug } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug: slug as string },
  })

  if (!dictionary) {
    return reply.send(errorResult(null, messages.dictionary_not_found))
  }

  const word = await prisma.words.findFirst({
    where: { id: wordId },
  })

  if (!word) {
    return reply.send(errorResult(null, messages.word_not_found))
  }

  const userWord = await prisma.userWords.findFirst({
    where: { word, authorId: userId },
  })

  const dictUserWord = {
    dictionaryId: dictionary.id,
    userWordId: 0,
  }

  if (!userWord) {
    const newUserWord = await prisma.userWords.create({
      data: {
        wordId,
        authorId: userId as string,
      },
    })
    dictUserWord.userWordId = newUserWord.id
  } else {
    dictUserWord.userWordId = userWord.id
  }

  await prisma.dictAndUserWords.create({
    data: dictUserWord,
  })

  return reply.send(successResult(null, messages.success))
}

export const GetWords = async (req: FastifyRequest<{ Querystring: GetDictionaryType }>, reply: FastifyReply) => {
  const { slug } = req.query
  const userId = req.user?.id
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: {
      authorId: userId,
      slug,
    },
    include: {
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

  const responseData = {
    words: [] as Words[],
    numberOfWords: dictionary?.UserWords.length,
  }

  dictionary?.UserWords.map((w) => responseData.words.push(w.userWord.word))

  if (!dictionary) return reply.send(errorResult(null, messages.dictionary_not_found))

  return reply.send(successResult(responseData, messages.success))
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

  if (!dictionary) return errorResult(null, messages.dictionary_not_found)

  if (dictionary.authorId === userId) return errorResult(null, messages.subscription_own_dic)

  const subscribedDics = await prisma.subscribedDics.findFirst({
    where: {
      userId,
      dictionaryId: dictionary.id,
    },
  })

  if (subscribedDics) return errorResult(null, messages.dictionary_already_subscribed)

  await prisma.subscribedDics.create({
    data: {
      dictionaryId: dictionary.id,
      userId: userId as string,
    },
  })

  return successResult(null, messages.success)
}

export const Unsubscribe = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const { slug } = req.query
  const userId = req.user?.id
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({ where: { slug } })
  if (!dictionary) return reply.send(errorResult(null, messages.dictionary_not_found))

  const subbedDics = await prisma.subscribedDics.findFirst({
    where: {
      userId,
      dictionaryId: dictionary.id,
    },
  })

  if (!subbedDics) return reply.send(errorResult(null, messages.dictionary_not_found))

  await prisma.subscribedDics.delete({ where: { id: subbedDics.id } })

  return reply.send(successResult(null, messages.success))
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
      return reply.send(errorResult(null, messages.dictionary_invalid_type))
  }

  return reply.send(successResult(publicDics, messages.success))
}

export const GetPublicDictionaries = async (req: FastifyRequest<{ Querystring: GetPublicDictionariesValidationType }>, reply: FastifyReply) => {
  const prisma = req.server.prisma

  const { page = 1, size = 10 } = req.query

  const publicDics = await prisma.dictionaries.findMany({
    where: {
      published: true,
    },
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

export const UpdateImage = async (req: FastifyRequest<{ Body: UpdateImageValidationType }>, reply: FastifyReply) => {
  const { dictionaryId, encodedImage } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({ where: { id: dictionaryId } })
  if (!dictionary) {
    return reply.send(errorResult(null, messages.dictionary_not_found))
  }

  const resultOfUploading: UploadingType = uploadImage('dictionary', dictionary.slug, encodedImage as string)
  if (!resultOfUploading.success) {
    return reply.send(errorResult(null, messages.uploading_file))
  }

  const image = resultOfUploading.url

  await prisma.dictionaries.update({ data: { image }, where: { id: dictionaryId } })

  if (resultOfUploading) {
    return reply.send(successResult({ image }, messages.success))
  }
}
