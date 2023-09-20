import { FastifyInstance } from 'fastify'
import { CreateFeedbackSchema, GetAllFeedbackSchema } from './general.schema'
import { CreateFeedback, GetAllFeedback } from './general.controller'

export default async function (fastify: FastifyInstance) {
  fastify.post('/feedback', { schema: CreateFeedbackSchema, preValidation: fastify.authVerify }, CreateFeedback)

  fastify.get('/getfeedbacks', { schema: GetAllFeedbackSchema, preValidation: fastify.authVerify }, GetAllFeedback)
}
