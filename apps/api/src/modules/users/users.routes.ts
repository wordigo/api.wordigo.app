import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { GetByIdSchema, GetMeSchema, DeleteSchema, UpdateAvatarSchema } from './users.schema'
import { GetById, GetMe, Delete, UpdateAvatar } from './users.controller'
import Resend, { renderEmail } from '@wordigo/email'

export default async (fastify: FastifyInstance) => {
  fastify.get('/getMe', { schema: GetMeSchema, preValidation: fastify.authVerify }, GetMe)

  fastify.get('/getById', { schema: GetByIdSchema, preValidation: fastify.authVerify }, GetById)

  fastify.delete('/delete', { schema: DeleteSchema, preValidation: fastify.authVerify }, Delete)

  fastify.put('/updateAvatar', { schema: UpdateAvatarSchema, preValidation: fastify.authVerify }, UpdateAvatar)

  fastify.get('/test', async (req: FastifyRequest, reply: FastifyReply) => {
    let test = await Resend.emails.send({
      from: 'noreply@wordigo.app',
      to: 'dlsmnosman@gmail.com',
      subject: 'Hello World',
      react: renderEmail({ type: 'welcome', props: {} }) as any,
    })
    console.log(test)

    reply.send('test')
  })
}
