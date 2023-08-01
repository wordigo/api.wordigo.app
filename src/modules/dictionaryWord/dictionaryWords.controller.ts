import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import {
  GetWordsValidationSchema,
  AddWordValidationSchema,
  DeleteWordValidationSchema,
} from './dictionaryWords.schema'
import { FromSchema } from 'json-schema-to-ts'

type DeleteWordSchemaType = FromSchema<typeof DeleteWordValidationSchema>
type AddWordSchemaType = FromSchema<typeof AddWordValidationSchema>
type GetWordsSchemaType = FromSchema<typeof GetWordsValidationSchema>

export const AddWord = async (
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

export const GetWords = async (
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

export const DeleteWord = async (
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
