import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import slugify from 'slugify'

import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { Words } from '@prisma/client'
import { randomUUID } from 'crypto'
import i18next from 'i18next'
import { UploadingType, uploadImage } from '../../utils/helpers/fileUploading.helper'
import { checkingOfLanguages } from '../translation/translate.service'
import { AddWordValidation, CreateDictionaryValidation, GetDictionaryBySlugValidation, RemoveWordValidation, UpdateDictionaryValidation, UpdateImageValidation } from './dictionaries.schema'
import { DictionaryInitialTitle } from './dictionaries.types'

type GetDictionaryBySlugType = FromSchema<typeof GetDictionaryBySlugValidation>
type CreateDictionaryType = FromSchema<typeof CreateDictionaryValidation>
type UpdateDictionaryType = FromSchema<typeof UpdateDictionaryValidation>
type RemoveWordType = FromSchema<typeof RemoveWordValidation>
type AddWordType = FromSchema<typeof AddWordValidation>
type UpdateImageType = FromSchema<typeof UpdateImageValidation>

export const Create = async (req: FastifyRequest<{ Body: CreateDictionaryType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { title, targetLang, sourceLang } = req.body
  const prisma = req.server.prisma

  if (title && title.trim().toLowerCase() === DictionaryInitialTitle) return reply.send(errorResult(null, i18next.t(messages.dictionary_already_exists)))

  if (sourceLang && targetLang) {
    const doLangsExist = checkingOfLanguages(sourceLang as string, targetLang as string)

    if (!doLangsExist?.success) return reply.send(errorResult(null, i18next.t(doLangsExist?.message as string)))
  }

  // const doLangsExist = AllCountryLanguages.filter((lang) => {
  //   return lang.code.toLowerCase() === sourceLang?.trim().toLowerCase() || lang.code.toLowerCase() === targetLang?.trim().toLowerCase()
  // })

  // if (doLangsExist.length !== 2) {
  //   return reply.send(errorResult(null, i18next.t(messages.language_not_found)))
  // }

  let slug
  while (true) {
    const randomUID = randomUUID().split('-')
    slug = slugify(`${title}-${randomUID[0]}${randomUID[1]}${randomUID[2]}`, {
      replacement: '-',
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true,
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

  return reply.send(successResult(newDictionary, i18next.t(messages.success)))
}

export const Update = async (req: FastifyRequest<{ Body: UpdateDictionaryType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  let { slug, title, published, description, rate, level, targetLang, sourceLang } = req.body
  const prisma = req.server.prisma

  if (title && title.trim().toLowerCase() === DictionaryInitialTitle) return reply.send(errorResult(null, i18next.t(messages.dictionary_initial_update)))

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug },
  })

  if (!dictionary) return reply.send(errorResult(null, i18next.t(messages.dictionary_not_found)))

  if (dictionary.title === DictionaryInitialTitle) return reply.send(errorResult(null, i18next.t(messages.dictionary_initial_update)))

  const updatedDictionary = await prisma.dictionaries.update({
    where: { id: dictionary.id },
    data: { title, published, rate, description, level, targetLang, sourceLang },
  })

  return reply.send(successResult(updatedDictionary, i18next.t(messages.success)))
}

export const Delete = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { slug } = req.query
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug },
  })

  if (!dictionary) {
    return errorResult(null, i18next.t(messages.dictionary_not_found))
  }

  await prisma.dictionaries.delete({
    where: { id: dictionary.id },
  })

  return reply.send(successResult(null, i18next.t(messages.success)))
}

export const GetList = async (req: FastifyRequest, reply: FastifyReply) => {
  const prisma = req.server.prisma
  const dictionaries = await prisma.dictionaries.findMany()

  return reply.send(successResult(dictionaries, i18next.t(messages.success)))
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

  return reply.send(successResult(result, i18next.t(messages.success)))
}

export const GetUserDictionaryBySlug = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
  const { slug } = req.query
  const prisma = req.server.prisma

  const userDictionaries = await prisma.dictionaries.findFirst({
    where: {
      authorId: req.user?.id,
      slug,
    },
  })

  return reply.send(successResult(userDictionaries, i18next.t(messages.success)))
}

export const RemoveWord = async (req: FastifyRequest<{ Body: RemoveWordType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { wordId, slug } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug: slug as string },
  })

  if (!dictionary) {
    return reply.send(errorResult(null, i18next.t(messages.dictionary_not_found)))
  }

  const word = await prisma.words.findFirst({
    where: { id: wordId },
  })

  if (!word) {
    return reply.send(errorResult(null, i18next.t(messages.word_not_found)))
  }

  const userWord = await prisma.userWords.findFirst({
    where: { word, authorId: userId },
  })

  if (!userWord) {
    return reply.send(errorResult(null, i18next.t(messages.userWord_not_found)))
  }

  await prisma.dictAndUserWords.delete({
    where: { userWordId_dictionaryId: { dictionaryId: dictionary.id, userWordId: userWord.id } },
  })

  return reply.send(successResult(null, i18next.t(messages.success)))
}

export const AddWord = async (req: FastifyRequest<{ Body: AddWordType }>, reply: FastifyReply) => {
  const userId = req.user?.id
  const { wordId, slug } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, slug: slug as string },
  })

  if (!dictionary) {
    return reply.send(errorResult(null, i18next.t(messages.dictionary_not_found)))
  }

  const word = await prisma.words.findFirst({
    where: { id: wordId },
  })

  if (!word) {
    return reply.send(errorResult(null, i18next.t(messages.word_not_found)))
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

  return reply.send(successResult(null, i18next.t(messages.success)))
}

export const GetWords = async (req: FastifyRequest<{ Querystring: GetDictionaryBySlugType }>, reply: FastifyReply) => {
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

  if (!dictionary) return reply.send(errorResult(null, i18next.t(messages.dictionary_not_found)))

  return reply.send(successResult(responseData, i18next.t(messages.success)))
}

export const UpdateImage = async (req: FastifyRequest<{ Body: UpdateImageType }>, reply: FastifyReply) => {
  const { dictionaryId, encodedImage } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({ where: { id: dictionaryId } })
  if (!dictionary) {
    return reply.send(errorResult(null, i18next.t(messages.dictionary_not_found)))
  }

  const resultOfUploading: UploadingType = await uploadImage('dictionary', dictionary.slug, encodedImage as string)
  if (!resultOfUploading.success) {
    return reply.send(errorResult(null, i18next.t(messages.uploading_file)))
  }

  const image = resultOfUploading.url as string

  await prisma.dictionaries.update({ data: { image }, where: { id: dictionaryId } })

  if (resultOfUploading) {
    return reply.send(successResult({ image }, i18next.t(messages.success)))
  }
}
