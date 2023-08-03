import { FastifyInstance } from 'fastify'
import { GetUserByIdSchema, GetUserMeSchema } from './users.schema'
import { GetUserById, GetUserMe } from './users.controller'

export default async (fastify: FastifyInstance) => {
  fastify.get('/getUserMe', { schema: GetUserMeSchema, preValidation: fastify.authVerify }, GetUserMe)
  fastify.get('/getUserById', { schema: GetUserByIdSchema, preValidation: fastify.authVerify }, GetUserById)
}
