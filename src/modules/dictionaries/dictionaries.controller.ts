import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { AddWordValidation, CreateDictionaryValidation, GetDictionaryByIdValidation, GetPublicDictionariesValidation, RemoveWordValidation, UpdateDictionaryValidation } from './dictionaries.schema'
import { FromSchema } from 'json-schema-to-ts'
import { TypesOfPublics } from './dictionaries.types'
import { Dictionaries, Words } from '@prisma/client'
import slugify from 'slugify'
import { DictionaryInitialTitle } from './dictionaries.types'

type GetDictionaryByIdType = FromSchema<typeof GetDictionaryByIdValidation>
type CreateDictionaryType = FromSchema<typeof CreateDictionaryValidation>
type UpdateDictionaryType = FromSchema<typeof UpdateDictionaryValidation>
type RemoveWordType = FromSchema<typeof RemoveWordValidation>
type AddWordType = FromSchema<typeof AddWordValidation>
type GetPublicDictionariesType = FromSchema<typeof GetPublicDictionariesValidation>

export const Create = async (req: FastifyRequest<{ Body: CreateDictionaryType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { title, targetLang, sourceLang } = req.body
  const prisma = req.server.prisma

  const dictionaryFromDb = await prisma.dictionaries.findFirst({
    where: { title: title.trim().toLowerCase() },
  })

  if (dictionaryFromDb) return reply.send(errorResult(null, messages.dictionary_already_exists, messages.dictionary_already_exists_code))

  const slug = slugify(title.trim().toLowerCase(), {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })

  const newDictionary = await prisma.dictionaries.create({
    data: {
      title: title.trim().toLowerCase(),
      authorId: userId,
      slug,
      targetLang,
      sourceLang,
    },
  })

  return reply.send(successResult(newDictionary, messages.success, messages.success_code))
}

export const Update = async (req: FastifyRequest<{ Body: UpdateDictionaryType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  let { dictionaryId, title, published, description, rate, level, image, targetLang, sourceLang } = req.body
  const prisma = req.server.prisma

  if (title) {
    const dictionaryFromDb = await prisma.dictionaries.findFirst({
      where: { title: title?.trim().toLowerCase() },
    })

    if (dictionaryFromDb) return reply.send(errorResult(null, messages.dictionary_already_exists, messages.dictionary_already_exists_code))
  }

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
  })

  if (!dictionary) return errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code)

  if (dictionary.title === DictionaryInitialTitle) return reply.send(errorResult(null, messages.dictionary_initial_update, messages.dictionary_initial_update_code))

  const updatedDictionary = await prisma.dictionaries.update({
    where: { id: dictionaryId },
    data: { title, published, rate, description, level, image, targetLang, sourceLang },
  })

  return reply.send(successResult(updatedDictionary, messages.success, messages.success_code))
}

export const Delete = async (req: FastifyRequest<{ Querystring: GetDictionaryByIdType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { dictionaryId } = req.query
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
  })

  if (!dictionary) {
    return errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code)
  }

  await prisma.dictionaries.delete({
    where: { id: dictionaryId },
  })

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export const GetList = async (req: FastifyRequest, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const dictionaries = prisma.dictionaries.findMany()

  return reply.send(successResult(dictionaries, messages.success, messages.success_code))
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
    return { ...dic, UserWords: dic.UserWords.length }
  })

  return reply.send(successResult(result, messages.success, messages.success_code))
}

export const GetUserDictionaryById = async (req: FastifyRequest<{ Querystring: GetDictionaryByIdType }>, reply: FastifyReply) => {
  const { dictionaryId } = req.query
  const prisma = req.server.prisma

  const userDictionaries = await prisma.dictionaries.findMany({
    where: {
      authorId: req.user?.id,
      id: dictionaryId,
    },
  })

  return reply.send(successResult(userDictionaries, messages.success, messages.success_code))
}

export const RemoveWord = async (req: FastifyRequest<{ Body: RemoveWordType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { wordId, dictionaryId } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
  })

  if (!dictionary) {
    return reply.send(errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code))
  }

  const word = await prisma.words.findFirst({
    where: { id: wordId },
  })

  if (!word) {
    return reply.send(errorResult(null, messages.word_not_found, messages.word_not_found_code))
  }

  const userWord = await prisma.userWords.findFirst({
    where: { word, authorId: userId },
  })

  if (!userWord) {
    return reply.send(errorResult(null, messages.userWord_not_found, messages.userWord_not_found_code))
  }

  await prisma.dictAndUserWords.delete({
    where: { userWordId_dictionaryId: { dictionaryId, userWordId: userWord.id } },
  })

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export const AddWord = async (req: FastifyRequest<{ Body: AddWordType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { wordId, dictionaryId } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
  })

  if (!dictionary) {
    return reply.send(errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code))
  }

  const word = await prisma.words.findFirst({
    where: { id: wordId },
  })

  if (!word) {
    return reply.send(errorResult(null, messages.word_not_found, messages.word_not_found_code))
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

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export const GetWords = async (req: FastifyRequest<{ Querystring: GetDictionaryByIdType }>, reply: FastifyReply) => {
  const { dictionaryId } = req.query
  const userId = req.user?.id
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
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

  if (!dictionary) return reply.send(errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code))

  return reply.send(successResult(responseData, messages.success, messages.success_code))
}

export const Subscribe = async (req: FastifyRequest<{ Querystring: GetDictionaryByIdType }>, reply: FastifyReply) => {
  const { dictionaryId } = req.query
  const userId = req.user?.id
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: {
      id: dictionaryId,
    },
  })

  if (!dictionary) return errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code)

  if (dictionary.authorId === userId) return errorResult(null, messages.subscription_own_dic, messages.subscription_own_dic_code)

  const subscribedDics = await prisma.subscribedDics.findFirst({
    where: {
      userId,
      dictionaryId,
    },
  })

  if (subscribedDics) return errorResult(null, messages.dictionary_already_subscribed, messages.dictionary_already_subscribed_code)

  await prisma.dictionaries.update({
    where: {
      id: dictionaryId,
    },
    data: {
      subscribers: dictionary.subscribers + 1,
    },
  })

  await prisma.subscribedDics.create({
    data: {
      dictionaryId,
      userId: userId as string,
    },
  })

  return successResult(null, messages.success, messages.success_code)
}

export const Unsubscribe = async (req: FastifyRequest<{ Querystring: GetDictionaryByIdType }>, reply: FastifyReply) => {
  const { dictionaryId } = req.query
  const userId = req.user?.id
  const prisma = req.server.prisma

  const subbedDics = await prisma.subscribedDics.findFirst({
    where: {
      userId,
      dictionaryId,
    },
  })

  if (!subbedDics) return reply.send(errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code))

  await prisma.subscribedDics.delete({ where: { id: subbedDics.id } })

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export const GetPublicDictionaries = async (req: FastifyRequest<{ Querystring: GetPublicDictionariesType }>, reply: FastifyReply) => {
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
      return reply.send(errorResult(null, messages.dictionary_invalid_type, messages.dictionary_invalid_type_code))
  }

  return reply.send(successResult(publicDics, messages.success, messages.success_code))
}
