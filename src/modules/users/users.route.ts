import { FastifyInstance } from 'fastify'
import { GetByIdSchema, GetMeSchema, DeleteSchema, UpdateAvatarSchema } from './users.schema'
import { GetById, GetMe, Delete, UpdateAvatar } from './users.controller'

export default async (fastify: FastifyInstance) => {
  fastify.get('/getMe', { schema: GetMeSchema, preValidation: fastify.authVerify }, GetMe)

  fastify.get('/getById', { schema: GetByIdSchema, preValidation: fastify.authVerify }, GetById)

  fastify.delete('/delete', { schema: DeleteSchema, preValidation: fastify.authVerify }, Delete)

  fastify.put('/updateAvatar', { schema: UpdateAvatarSchema, preValidation: fastify.authVerify }, UpdateAvatar)
}
