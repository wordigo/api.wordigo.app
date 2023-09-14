import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { TranslationValidationBody } from './translate.schema'

import messages from '@/utils/constants/messages'
import { successResult } from '@/utils/constants/results'
import i18next from 'i18next'

import { options } from './translate.service'
import axios from 'axios'

type TranslationValidationTye = FromSchema<typeof TranslationValidationBody>

export interface ITranslateOptions {
  to?: string
  from?: string
  data?: string
  platform: 'api'
}

export async function TextTranslate(request: FastifyRequest<{ Body: TranslationValidationTye }>, reply: FastifyReply) {
  const { query, targetLanguage, sourceLanguage } = request.body
  const translateOptions: ITranslateOptions = {
    data: query,
    to: targetLanguage,
    platform: 'api',
  }
  if (sourceLanguage !== 'detech') translateOptions.from = sourceLanguage

  const { data } = await axios.create(options).post('https://lingvanex-translate.p.rapidapi.com/translate', translateOptions)

  const { translatedText, detectedSourceLanguage } = { translatedText: data.result, detectedSourceLanguage: data?.from }

  return reply.send(
    successResult(
      {
        translatedText,
        sourceLanguage: detectedSourceLanguage || sourceLanguage,
        targetLanguage,
      },
      i18next.t(messages.success)
    )
  )
}
