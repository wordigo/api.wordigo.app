import { FastifyInstance } from 'fastify'
import { GetPublicDictionaries, GetPublicDictionaryById, Subscribe, Unsubscribe } from './publicDictionaries.controller'
import { GetPublicDictionariesSchema, GetUserDictionaryByIdSchema, SubscribeSchema, UnsubscribeSchema } from './publicDictionaries.schema'

export default async (fastify: FastifyInstance) => {
  fastify.post('/subscribe', { schema: SubscribeSchema, preValidation: fastify.authVerify }, Subscribe)

  fastify.post('/unsubscribe', { schema: UnsubscribeSchema, preValidation: fastify.authVerify }, Unsubscribe)

  fastify.get('/getPublicDictionaryById', { schema: GetUserDictionaryByIdSchema }, GetPublicDictionaryById)

  fastify.get('/getPublicDictionaries', { schema: GetPublicDictionariesSchema }, GetPublicDictionaries)
}
