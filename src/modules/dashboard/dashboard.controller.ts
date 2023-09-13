import { FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'

import messages from '../../utils/constants/messages'
import { successResult } from '../../utils/constants/results'
import { prisma } from '@/lib/prisma'
import { DictionaryInitialTitle } from '../dictionaries/dictionaries.types'

export const GetStatistics = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user

  const dictionaries = await prisma.dictionaries.findMany({ where: { authorId: user.id }, include: { UserWords: true } })

  const numberOfDictionaries = dictionaries.length
  const initalDictionary = dictionaries.filter((dic) => {
    return (dic.title = DictionaryInitialTitle)
  })[0]

  const numberOfWords = initalDictionary.UserWords.length

  const numberOfSubbedDics = (await prisma.subscribedDics.findMany({ where: { userId: user.id } })).length

  const numberOfPublicDics = dictionaries.filter((dic) => {
    return dic.published === true
  }).length

  const result = { numberOfDictionaries, numberOfWords, numberOfSubbedDics, numberOfPublicDics }

  return reply.send(successResult(result, i18next.t(messages.success)))
}
