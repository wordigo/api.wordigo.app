import { FastifyInstance } from 'fastify'
import { GetUserMeSchema } from './users.schema'
import { GetUserMe } from './users.controller'

export default async function (fastify: FastifyInstance) {
  fastify.get('/getUserMe', { schema: GetUserMeSchema, preValidation: fastify.authVerify }, GetUserMe)
}
