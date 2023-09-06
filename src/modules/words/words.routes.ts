import { FastifyInstance } from 'fastify'
import { CreateSchema, GetListSchema } from './words.schema'
import { Create, GetList } from './words.controller'

export default async (fastify: FastifyInstance) => {
  fastify.post(
    '/create',
    {
      schema: CreateSchema,
      preValidation: fastify.authVerify,
    },
    Create
  )

  fastify.get(
    '/getList',
    {
      schema: GetListSchema,
    },
    GetList
  )
}
