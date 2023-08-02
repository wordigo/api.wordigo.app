// import { PrismaClient } from '@prisma/client'
import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { CreateWordValidation } from './words.schema'
import { AllCountryLanguages, DictionaryInitialTitle } from './words.types'
import { LearningStatuses } from '@/utils/constants/enums'

type CreateWordType = FromSchema<typeof CreateWordValidation>

export const Create = async (
  req: FastifyRequest<{ Body: CreateWordType }>,
  reply: FastifyReply
) => {
  const { text, translatedText, nativeLanguage, targetLanguage, dictionaryId } = req.body
  const userId = req.user?.id
  const prisma = req.server.prisma

  if (nativeLanguage?.trim().toLowerCase() === targetLanguage?.trim().toLowerCase())
    return reply.send(
      errorResult(null, messages.languages_cant_same, messages.languages_cant_same_code)
    )

  if ((dictionaryId as number) > 0) {
    const dicFromDb = await prisma.dictionaries.findFirst({
      where: {
        id: dictionaryId,
        authorId: userId,
      },
    })

    if (!dicFromDb) {
      return reply.send(
        errorResult(null, messages.dictionary_not_found, messages.dictionary_not_found_code)
      )
    }
  }

  const doLangsExist = AllCountryLanguages.filter((lang) => {
    return (
      lang.code.toLowerCase() === nativeLanguage.trim().toLowerCase() ||
      lang.code.toLowerCase() === targetLanguage.trim().toLowerCase()
    )
  })

  if (doLangsExist.length !== 2) {
    return reply.send(
      errorResult(null, messages.language_not_found, messages.language_not_found_code)
    )
  }

  const wordFromDb = await prisma.words.findFirst({
    where: {
      text: text.trim().toLowerCase(),
      translatedText: translatedText.trim().toLowerCase(),
      nativeLanguage: nativeLanguage.trim().toLowerCase(),
      targetLanguage: targetLanguage.trim().toLowerCase(),
    },
  })

  let word
  if (!wordFromDb)
    word = await prisma.words.create({
      data: {
        text: text.trim().toLowerCase(),
        translatedText: translatedText.trim().toLowerCase(),
        nativeLanguage,
        targetLanguage,
      },
    })
  else word = wordFromDb

  const wordExistInUserWord = await prisma.userWords.findFirst({
    where: {
      authorId: userId,
      wordId: word.id,
    },
  })

  let userWord

  if (wordExistInUserWord) userWord = wordExistInUserWord
  else
    userWord = await prisma.userWords.create({
      data: {
        wordId: word.id,
        learningStatus: LearningStatuses['Not Learned'],
        authorId: userId as string,
      },
    })

  let initialDictionary = await prisma.dictionaries.findFirst({
    where: {
      title: DictionaryInitialTitle,
    },
  })
  if (!initialDictionary) {
    initialDictionary = await prisma.dictionaries.create({
      data: {
        title: DictionaryInitialTitle,
        authorId: userId,
      },
    })
  }

  const initialDicExisting = await prisma.dictAndUserWords.findFirst({
    where: {
      userWordId: userWord.id,
      dictionaryId: initialDictionary?.id,
    },
  })

  if (!initialDicExisting)
    await prisma.dictAndUserWords.create({
      data: {
        userWordId: userWord.id,
        dictionaryId: initialDictionary?.id,
      },
    })

  if (dictionaryId) {
    const dictExisting = await prisma.dictAndUserWords.findFirst({
      where: {
        userWordId: userWord.id,
        dictionaryId,
      },
    })

    if (!dictExisting)
      await prisma.dictAndUserWords.create({
        data: {
          userWordId: userWord.id,
          dictionaryId,
        },
      })
  }

  return reply.send(successResult(null, messages.success, messages.success_code))
}
