import { FastifyInstance } from 'fastify'
import { GetPublicDictionaries, GetPublicDictionaryBySlug, GetUserPublicDictionaries, Subscribe, Unsubscribe } from './publicDictionaries.controller'
import { GetPublicDictionariesSchema, GetUserDictionaryBySlugSchema, GetUserPublicDictionariesSchema, SubscribeSchema, UnsubscribeSchema } from './publicDictionaries.schema'

export default async (fastify: FastifyInstance) => {
  fastify.post('/subscribe', { schema: SubscribeSchema, preValidation: fastify.authVerify }, Subscribe)

  fastify.post('/unsubscribe', { schema: UnsubscribeSchema, preValidation: fastify.authVerify }, Unsubscribe)

  fastify.get('/getPublicDictionaryBySlug', { schema: GetUserDictionaryBySlugSchema }, GetPublicDictionaryBySlug)

  fastify.get('/getPublicDictionaries', { schema: GetPublicDictionariesSchema }, GetPublicDictionaries)

  fastify.get('/getUserPublicDictionaries', { schema: GetUserPublicDictionariesSchema, preValidation: fastify.authVerify }, GetUserPublicDictionaries)
}
