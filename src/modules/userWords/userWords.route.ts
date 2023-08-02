import { FastifyInstance } from 'fastify'
import { DeleteSchema } from './userWords.schema'
import { Delete } from './userWords.controller'

import { authMiddleware } from '@/lib/fastify-passport'

export default async (fastify: FastifyInstance) => {
  fastify.delete(
    '/delete',
    {
      schema: DeleteSchema,
      preValidation: authMiddleware,
    },
    Delete
  )
}
