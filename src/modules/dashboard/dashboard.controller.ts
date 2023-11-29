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
  let firstDayOfDates = 0
  let firstDayOfWeek = 0

  for (let i = 0;i < dates.length;i++) {
    switch (typeOfStatistic) {
      case TypesOfStatistic.daily || TypesOfStatistic.monthly:
        {
          let parsedDate = 0

          // to evaluating the value of day or month, getting 01 from 01.01.2023 
          if (typeOfStatistic == TypesOfStatistic.daily) {
            parsedDate = parseInt(dates[i].toISOString().slice(8, 11))
          }
          else if (typeOfStatistic == TypesOfStatistic.monthly) {
            parsedDate = parseInt(dates[i].toISOString().slice(5, 8))
          }

          if (parsedDate != dateValue) {
            numberOfDateValue++
            dateValue = parsedDate
            sumOfInsert += numberOfInsert
            numberOfInsert = 0
          }

          if (numberOfInsert == 0 && parsedDate == dateValue) {
            for (let j = i;j < dates.length;j++) {
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

              if (nestedParsedDate == dateValue)
                numberOfInsert++
              else
                break
            }
          }

          if (numberOfInsert > 0 && i == dates.length - 1) {
            sumOfInsert += numberOfInsert
          }
        }
      case TypesOfStatistic.weekly: {
        if (firstDayOfWeek == 0 || (firstDayOfWeek != 0 && dates[i].getDay() + 1 > 7)) {
          firstDayOfWeek = dates[i].getDay()
          firstDayOfDates = parseInt(dates[i].toISOString().slice(8, 11))
          numberOfDateValue++
          sumOfInsert += numberOfInsert
          numberOfInsert = 0
        }

        let firstDay = firstDayOfDates - firstDayOfWeek
        let lastDay = firstDayOfDates + (7 - (firstDayOfWeek + 1))

        for (let j = 0;j < dates.length;j++) {
          const dayNumber = parseInt(dates[j].toISOString().slice(8, 11))
          if (dayNumber <= lastDay && dayNumber >= firstDay) {
            numberOfInsert++
          }
        }
      }
      default:
        break
    }

    console.log(numberOfDateValue, sumOfInsert)
    console.log(sumOfInsert / numberOfDateValue)
  }
}

// const GetDay = (date: Date): string => {
//   const dayOfNumber = date.getDay()

//   switch (dayOfNumber) {
//     case 0:
//       return Days.monday
//     case 1:
//       return Days.tuesday
//     case 2:
//       return Days.wednesday
//     case 3:
//       return Days.thursday
//     case 4:
//       return Days.friday
//     case 5:
//       return Days.saturday
//     case 6:
//       return Days.sunday
//     default:
//       return ''
//   }
// }

// enum Days {
//   monday = "Monday",
//   tuesday = "Tuesday",
//   wednesday = "Wednesday",
//   thursday = "Thursday",
//   friday = "Friday",
//   saturday = "Saturday",
//   sunday = "Sunday",
// }