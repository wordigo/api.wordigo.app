import { FastifyInstance } from 'fastify'
import { CreateWordSchema } from './words.schema'
import { Create } from './words.controller'

export default async (fastify: FastifyInstance) => {
  fastify.post(
    '/create',
    {
      schema: CreateWordSchema,
      preValidation: fastify.authVerify,
    },
    Create
  )
}
