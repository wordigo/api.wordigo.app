import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { TranslationValidationBody } from './translate.schema'

import messages from '@/utils/constants/messages'
import { successResult } from '@/utils/constants/results'
import { Translate } from '@google-cloud/translate/build/src/v2'
import i18next from 'i18next'
import { translateApi } from './translate.service'

const translate = new Translate({
  projectId: process.env.CLOUD_TRANSLATE_PROJECT_ID,
  key: process.env.CLOUD_TRANSLATE_API_KEY,
})

type TranslationValidationTye = FromSchema<typeof TranslationValidationBody>

export interface ITranslateOptions {
  params: {
    'api-version': string
    to: string
    from?: string
  }
  data: {
    text: string
  }
}

export async function TextTranslate(request: FastifyRequest<{ Body: TranslationValidationTye }>, reply: FastifyReply) {
  const { query, targetLanguage, sourceLanguage } = request.body
  const params: ITranslateOptions['params'] = {
    'api-version': '3.0',
    to: targetLanguage,
  }

  if (sourceLanguage) params.from = sourceLanguage

  const { data } = await translateApi.post(
    '/translate',
    [
      {
        text: query,
      },
    ],
    {
      params,
    }
  )

  const { text, to } = data[0].translations[0]

  return reply.send(
    successResult(
      {
        text,
        sourceLanguage: sourceLanguage || to,
        targetLanguage,
      },
      i18next.t(messages.success)
    )
  )
}
