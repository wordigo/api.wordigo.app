import { FastifyInstance } from 'fastify'
import { GetSchema } from './dashboard.schema'
import { GetStatistics } from './dashboard.controller'

export default async function (fastify: FastifyInstance) {
  fastify.get('/getStatistics', { schema: GetSchema, preValidation: fastify.authVerify }, GetStatistics)
}
