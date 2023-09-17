import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { TranslationValidationBody } from './translate.schema'

import messages from '@/utils/constants/messages'
import { successResult } from '@/utils/constants/results'
import i18next from 'i18next'
import { translateApi } from './translate.service'

type TranslationValidationTye = FromSchema<typeof TranslationValidationBody>

export interface ITranslateOptions {
  target_language?: string
  source_language?: string
  text?: string
}

export async function TextTranslate(request: FastifyRequest<{ Body: TranslationValidationTye }>, reply: FastifyReply) {
  const { query, targetLanguage, sourceLanguage } = request.body
  const translateOptions: ITranslateOptions = {
    text: query,
    target_language: targetLanguage,
    source_language: 'auto',
  }

  if (sourceLanguage !== 'auto') translateOptions.source_language = sourceLanguage

  const encodedParams = new URLSearchParams()
  encodedParams.set('source_language', translateOptions.source_language as string)
  encodedParams.set('target_language', translateOptions.target_language as string)
  encodedParams.set('text', translateOptions.text as string)

  const { data: response } = await translateApi.post('https://text-translator2.p.rapidapi.com/translate', encodedParams).catch((err) => {
    console.log(err)
    return err
  })

  const { translatedText, detectedSourceLanguage } = { translatedText: response.data?.translatedText, detectedSourceLanguage: response?.data?.detectedSourceLanguage?.code }

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
