import { FastifyInstance } from 'fastify'
import { GetUserMeSchema } from './users.schema'
import { GetUserMe } from './users.controller'
import fastifyPassport from '@fastify/passport'

export const fastifyPreValidationJwt = {
  preValidation: fastifyPassport.authenticate('jwt', { session: false }),
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/getUserMe', { schema: GetUserMeSchema, ...fastifyPreValidationJwt }, GetUserMe)
}
