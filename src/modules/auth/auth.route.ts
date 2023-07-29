import { FastifyInstance } from 'fastify'
import { SignIn, GoogleOAuth, SignUp } from './auth.controller'
import fastifyPassport from '@fastify/passport'
import { GoogleAuthSchema, SignInSchema, SignUpSchema } from './auth.schema'

export const fastifyPreValidationJwt: any = {
  preValidation: fastifyPassport.authenticate('jwt', { session: false }),
}

export default async function (fastify: FastifyInstance) {
  fastify.post('/signIn', { schema: SignInSchema }, SignIn)

  fastify.post('/signUp', { schema: SignUpSchema }, SignUp)

  fastify.get('/googleAuth', { schema: GoogleAuthSchema }, GoogleOAuth)
}
