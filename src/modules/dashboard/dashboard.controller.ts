import { FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'

import messages from '../../utils/constants/messages'
import { successResult } from '../../utils/constants/results'
import { prisma } from '@/lib/prisma'
import { DictionaryInitialTitle } from '../dictionaries/dictionaries.types'
import { FromSchema } from 'json-schema-to-ts'
import { WordInteractionValidation } from './dashboard.schema'
import { TypesOfStatistic } from './dashboard.types'

type WordInteractionValidationType = FromSchema<typeof WordInteractionValidation>

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

export const WordInteraction = async (req: FastifyRequest<{ Querystring: WordInteractionValidationType }>, reply: FastifyReply) => {
  const user = req.user

  const { typeOfStatistic } = req.query as any

  const dates = (await prisma.userWords.findMany({ where: { authorId: user.id } })).map(w => w.createdDate)

  let sumOfInsert = 0
  let numberOfInsert = 0
  let numberOfDateValue = 0
  let dateValue = 0

  for (let i = 0;i < dates.length;i++) {
    let parsedDate = 0

    // to evaluating the value of day or month, getting 01 from 01.01.2023 
    if (typeOfStatistic == TypesOfStatistic.daily) {
      parsedDate = parseInt(dates[i].toISOString().slice(8, 11))
    }
    else if (typeOfStatistic == TypesOfStatistic.monthly) {
      parsedDate = parseInt(dates[i].toISOString().slice(5, 8))
    }
    else if (typeOfStatistic == TypesOfStatistic.weekly) {
      parsedDate = 0
    }
    console.log(parsedDate)

    if (parsedDate != dateValue) {
      numberOfDateValue++
      dateValue = parsedDate
      console.log(1, sumOfInsert, numberOfInsert)
      sumOfInsert += numberOfInsert
      numberOfInsert = 0
      console.log(2, sumOfInsert, numberOfInsert)
    }

    if (numberOfInsert == 0 && parsedDate == dateValue) {
      for (let j = 0;j < dates.length;j++) {
        let nestedParsedDate = 0

        // to evaluating the value of day or month, getting 01 from 01.01.2023 
        if (typeOfStatistic == TypesOfStatistic.daily) {
          nestedParsedDate = parseInt(dates[j].toISOString().slice(8, 11))
        }
        else if (typeOfStatistic == TypesOfStatistic.monthly) {
          nestedParsedDate = parseInt(dates[j].toISOString().slice(5, 8))
        }
        else if (typeOfStatistic == TypesOfStatistic.weekly) {
          nestedParsedDate = 0
        }

        if (nestedParsedDate == dateValue) {
          numberOfInsert++
        }
        else
          break
      }
    }

    if (numberOfInsert > 0 && i == dates.length - 1) {
      //console.log(dates.length, numberOfInsert, sumOfInsert)
      console.log(3, sumOfInsert, numberOfInsert)
      sumOfInsert += numberOfInsert
      console.log(4, sumOfInsert, numberOfInsert)
    }
  }

  console.log(numberOfDateValue, sumOfInsert)
  console.log(sumOfInsert / numberOfDateValue)

}