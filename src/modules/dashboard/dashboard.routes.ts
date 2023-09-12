import { FastifyInstance } from 'fastify'
import { GetSchema } from './dashboard.schema'
import { Get } from './dashboard.controller'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', { schema: GetSchema, preValidation: fastify.authVerify }, Get)
}
