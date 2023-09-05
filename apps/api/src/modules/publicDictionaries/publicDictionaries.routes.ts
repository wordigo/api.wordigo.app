import { FastifyInstance } from 'fastify'
import { GetPublicDictionaries, GetPublicDictionaryById } from './publicDictionaries.controller'
import { GetPublicDictionariesSchema, GetUserDictionaryByIdSchema } from './publicDictionaries.schema'

export default async (fastify: FastifyInstance) => {
  fastify.get('/getPublicDictionaryById', { schema: GetUserDictionaryByIdSchema }, GetPublicDictionaryById)

  fastify.get('/getPublicDictionaries', { schema: GetPublicDictionariesSchema }, GetPublicDictionaries)
}
