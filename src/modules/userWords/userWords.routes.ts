import { FastifyInstance } from 'fastify'
import { DeleteSchema } from './userWords.schema'
import { Delete } from './userWords.controller'

export default async (fastify: FastifyInstance) => {
  fastify.delete(
    '/delete',
    {
      schema: DeleteSchema,
      preValidation: fastify.authVerify,
    },
    Delete
  )
}
