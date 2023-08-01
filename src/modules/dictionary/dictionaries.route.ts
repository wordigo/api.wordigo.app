import { FastifyInstance } from 'fastify'
import { GetUserDictionariesSchema, GetUserDictionaryByIdSchema } from './dictionaries.schema'
import { GetUserDictionaries, GetUserDictionaryById } from './dictionaries.controller'
import fastifyPassport from '@fastify/passport'
import { authMiddleware } from '@/lib/fastify-passport'

export const fastifyPreValidationJwt = {
  preValidation: fastifyPassport.authenticate('jwt', { session: false }),
}

export default async (fastify: FastifyInstance) => {
  fastify.get(
    '/getUserDictionaries',
    {
      schema: GetUserDictionariesSchema,
      preValidation: authMiddleware,
    },
    GetUserDictionaries
  )

  fastify.get(
    '/getUserDictionaryById',
    {
      schema: { querystring: GetUserDictionaryByIdSchema },
      preValidation: authMiddleware,
    },
    GetUserDictionaryById
  )
}
