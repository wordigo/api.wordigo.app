import { FastifyInstance } from 'fastify'
import { SignIn, GoogleOAuth, SignUp } from './auth.controller'
import { GoogleAuthSchema, SignInSchema, SignUpSchema } from './auth.schema'

export default async function (fastify: FastifyInstance) {
  fastify.post('/signIn', { schema: SignInSchema }, SignIn)

  fastify.post('/signUp', { schema: SignUpSchema }, SignUp)

  fastify.get('/googleAuth', { schema: GoogleAuthSchema }, GoogleOAuth)
}
