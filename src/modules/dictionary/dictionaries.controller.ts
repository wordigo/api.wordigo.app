import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import {
  AddWordValidationSchema,
  CreateDictionaryValidationSchema,
  GetDictionaryByIdValidationSchema,
  RemoveWordValidationSchema,
  UpdateDictionaryValidationSchema,
} from './dictionaries.schema'
import { FromSchema } from 'json-schema-to-ts'

type GetDictionaryByIdSchemaType = FromSchema<typeof GetDictionaryByIdValidationSchema>
type CreateDictionarySchemaType = FromSchema<typeof CreateDictionaryValidationSchema>
type UpdateDictionarySchemaType = FromSchema<typeof UpdateDictionaryValidationSchema>
type RemoveWordSchemaType = FromSchema<typeof RemoveWordValidationSchema>
type AddWordSchemaType = FromSchema<typeof AddWordValidationSchema>

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
  req: FastifyRequest<{ Querystring: GetDictionaryByIdSchemaType }>,
  reply: FastifyReply
) => {
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

export const Create = async (
  req: FastifyRequest<{ Body: CreateDictionarySchemaType }>,
  reply: FastifyReply
) => {
  const userId = req.user?.id
  const { title, published } = req.body
  const prisma = req.server.prisma

  const dictionaryFromDb = await prisma.dictionaries.findFirst({
    where: { title: title.trim().toLowerCase() },
  })

  if (dictionaryFromDb)
    return reply.send(
      errorResult(null, messages.dictionary_already_exists, messages.dictionary_already_exists_code)
    )

  const newDictionary = await prisma.dictionaries.create({
    data: {
      title: title.trim().toLowerCase(),
      authorId: userId,
      published,
    },
  })

  return reply.send(successResult(newDictionary, messages.success, messages.success_code))
}

export const Update = async (
  req: FastifyRequest<{ Body: UpdateDictionarySchemaType }>,
  reply: FastifyReply
) => {
  const userId = req.user?.id
  const { dictionaryId, title, published } = req.body
  const prisma = req.server.prisma

  const dictionaryFromDb = await prisma.dictionaries.findFirst({
    where: { title: title.trim().toLowerCase() },
  })

  if (dictionaryFromDb)
    return reply.send(
      errorResult(null, messages.dictionary_already_exists, messages.dictionary_already_exists_code)
    )

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
  })

  if (!dictionary)
    return errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code)

  const updatedDictionary = await prisma.dictionaries.update({
    where: { id: dictionaryId },
    data: { title, published },
  })

  return reply.send(successResult(updatedDictionary, messages.success, messages.success_code))
}

export const Delete = async (
  req: FastifyRequest<{ Querystring: GetDictionaryByIdSchemaType }>,
  reply: FastifyReply
) => {
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

export const RemoveWord = async (
  req: FastifyRequest<{ Body: RemoveWordSchemaType }>,
  reply: FastifyReply
) => {
  const userId = req.user?.id
  const { wordId, dictionaryId } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
  })

  if (!dictionary) {
    return reply.send(
      errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code)
    )
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
    return reply.send(
      errorResult(null, messages.userWord_not_found, messages.userWord_not_found_code)
    )
  }

  await prisma.dictAndUserWords.delete({
    where: { userWordId_dictionaryId: { dictionaryId, userWordId: userWord.id } },
  })

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export const AddWord = async (
  req: FastifyRequest<{ Body: AddWordSchemaType }>,
  reply: FastifyReply
) => {
  const userId = req.user?.id
  const { wordId, dictionaryId } = req.body
  const prisma = req.server.prisma

  const dictionary = await prisma.dictionaries.findFirst({
    where: { authorId: userId, id: dictionaryId },
  })

  if (!dictionary) {
    return reply.send(
      errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code)
    )
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
