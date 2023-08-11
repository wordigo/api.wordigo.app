import { FastifyInstance } from 'fastify'
import { TextTranslate } from './translate.controller'
import { TranslationValidation } from './translate.schema'

export default async function (fastify: FastifyInstance) {
  // Translate endpoint
  fastify.post('/translate', { schema: TranslationValidation }, TextTranslate)
}
