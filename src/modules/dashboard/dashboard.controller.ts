import { FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'

import messages from '../../utils/constants/messages'
import { successResult } from '../../utils/constants/results'
import { prisma } from '@/lib/prisma'
import { DictionaryInitialTitle } from '../dictionaries/dictionaries.types'

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
  const user = req.user

  //const { typeOfStatistic } = req.query

  const dates = (await prisma.userWords.findMany({ where: { authorId: user.id } })).map(w => w.createdDate)

  /*

  let sumOfInsert = 0     all days, all months
  let numberOfInsert = 0  number of data with respect to context (daily, monthly)
  let numberOfDateValue = 0     how many days/months
  let dateValue = 0   current date (1. day or 4. month)

  loop(dates)
  {
    if(dates[i].day(or month) != dateValue){
      numberOfDateValue ++
      dateValue = dates[i].day(or month)
      sumOfInsert+=numberOfInsert
      numberOfInsert=0
    }

    if(numberOfInsert == 0 && dates[i].day(or month) == dateValue){
      loop(dates){
        if(dates[i].day(or month) == dateValue){
          numberOfInsert++
        }else{
          break
        }
      }
    }
  }

  */

  //console.log(firstDate, lastDate)
}