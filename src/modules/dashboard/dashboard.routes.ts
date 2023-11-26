import { FastifyInstance } from 'fastify'
import { GeneralStatisticSchema, WordInteractionSchema } from './dashboard.schema'
import { GeneralStatistic, WordInteraction } from './dashboard.controller'

export default async function (fastify: FastifyInstance) {
  fastify.get('/generalStatistic', { schema: GeneralStatisticSchema, preValidation: fastify.authVerify }, GeneralStatistic)

  fastify.get('/wordInteraction', { schema: WordInteractionSchema, preValidation: fastify.authVerify }, WordInteraction)
}
