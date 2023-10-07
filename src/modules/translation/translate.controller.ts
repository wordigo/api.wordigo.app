import { FastifyReply, FastifyRequest } from 'fastify'
import { TranslationValidationBody } from './translate.schema'
import { FromSchema } from 'json-schema-to-ts'

import { Translate } from '@google-cloud/translate/build/src/v2'
import { successResult } from '@/utils/constants/results'
import messages from '@/utils/constants/messages'
import i18next from 'i18next'

const translate = new Translate({
  projectId: process.env.CLOUD_TRANSLATE_PROJECT_ID,
  key: process.env.CLOUD_TRANSLATE_API_KEY,
})

type TranslationValidationTye = FromSchema<typeof TranslationValidationBody>

export interface ITranslateOptions {
  to?: string
  from?: string
}

export async function TextTranslate(
  request: FastifyRequest<{ Body: TranslationValidationTye }>,
  reply: FastifyReply
) {
  const { query, targetLanguage, sourceLanguage } = request.body
  const translateOptions: ITranslateOptions = {
    to: targetLanguage,
  }
  if (sourceLanguage) translateOptions.from = sourceLanguage
  const [, { data }] = await translate.translate(query, translateOptions)

  const { translatedText, detectedSourceLanguage } = data.translations[0]


  return reply.send(successResult({
    translatedText,
    sourceLanguage: sourceLanguage || detectedSourceLanguage,
    targetLanguage,
  }, i18next.t(messages.success)))

}