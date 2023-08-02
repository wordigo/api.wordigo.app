import { FastifyInstance } from 'fastify'
import { CreateWordSchema } from './words.schema'
import { Create } from './words.controller'
import { authMiddleware } from '@/lib/fastify-passport'

export default async (fastify: FastifyInstance) => {
  fastify.post(
    '/create',
    {
      schema: CreateWordSchema,
      preValidation: authMiddleware,
    },
    Create
  )
}
