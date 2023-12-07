import { FastifyInstance } from 'fastify'
import { Create, Delete, GetList } from './words.controller'
import { CreateSchema, DeleteSchema, GetListSchema } from './words.schema'

export default async (fastify: FastifyInstance) => {
  fastify.post(
    '/create',
    {
      schema: CreateSchema,
      preValidation: fastify.authVerify,
    },
    Create
  )

  fastify.delete(
    '/delete',
    {
      schema: DeleteSchema,
      preValidation: fastify.authVerify,
    },
    Delete
  )

  fastify.get(
    '/getList',
    {
      schema: GetListSchema,
    },
    GetList
  )
}
