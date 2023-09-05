import { FastifyInstance } from 'fastify'
import { GetByIdSchema, GetMeSchema, DeleteSchema, UpdateAvatarSchema, UpdateProfileSchema } from './users.schema'
import { GetById, GetMe, Delete, UpdateAvatar, UpdateProfile } from './users.controller'

export default async (fastify: FastifyInstance) => {
  fastify.get('/getMe', { schema: GetMeSchema, preValidation: fastify.authVerify }, GetMe)

  fastify.get('/getById', { schema: GetByIdSchema, preValidation: fastify.authVerify }, GetById)

  fastify.delete('/delete', { schema: DeleteSchema, preValidation: fastify.authVerify }, Delete)

  fastify.put('/updateAvatar', { schema: UpdateAvatarSchema, preValidation: fastify.authVerify }, UpdateAvatar)

  fastify.put('/updateProfile', { schema: UpdateProfileSchema, preValidation: fastify.authVerify }, UpdateProfile)
}
