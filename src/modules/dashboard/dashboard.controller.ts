import { FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'

import messages from '../../utils/constants/messages'
import { successResult } from '../../utils/constants/results'
import { prisma } from '@/lib/prisma'
import { DictionaryInitialTitle } from '../dictionaries/dictionaries.types'
import { FromSchema } from 'json-schema-to-ts'
import { TypesOfStatistic } from './dashboard.types'


export const GeneralStatistic = async (req: FastifyRequest, reply: FastifyReply) => {
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

export const WordInteraction = async (req: FastifyRequest, reply: FastifyReply) => {
  //const user = req.user
  const user = await prisma.users.findFirst({ where: { id: 'cloestp9w0000mc11ujktu21s' } })

  const userWords = (await prisma.userWords.findMany({ where: { authorId: user?.id } }))//.sort((a, b) => Number(b.createdDate) - Number(b.createdDate))

  let monthly: { day: number, words: number, todayDate: Date }[] = []

  let counterOfDays: number = 30

  for (let i = 0;i < 30;i++) {
    const currentDate = new Date()
    const previousDate = currentDate.setDate(currentDate.getDate() - i)

    const numberOfWordsOfCurrentDate = userWords.filter(w =>
      w.createdDate.getDate() == new Date(previousDate).getDate()
      && w.createdDate.getMonth() == new Date(previousDate).getMonth())
      .length

    monthly.push({ day: counterOfDays - i, words: numberOfWordsOfCurrentDate, todayDate: new Date(previousDate) })
  }

  return reply.send(successResult(monthly, i18next.t(messages.success)))
}