import { FastifyInstance } from 'fastify'
import { CreateFeedback } from './general.controller'
import { CreateFeedbackSchema } from './general.schema'

export default async function (fastify: FastifyInstance) {
  fastify.post('/feedback', { schema: CreateFeedbackSchema, preValidation: fastify.authVerify }, CreateFeedback)

  // fastify.get('/getfeedbacks', { schema: GetAllFeedbackSchema, preValidation: fastify.authVerify }, GetAllFeedback)
}
