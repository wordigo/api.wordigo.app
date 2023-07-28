import { FastifyInstance } from 'fastify'
import { SignIn, GoogleOAuth, SignUp } from './auth.controller'
import fastifyPassport from '@fastify/passport'
import { GoogleAuthSchema, SignInSchema, SignUpSchema } from './auth.schema'

export const fastifyPreValidationJwt: any = {
  preValidation: fastifyPassport.authenticate('jwt', { session: false }),
}

export default async function (fastify: FastifyInstance) {
  // // Get User Me
  // fastify.get('/getUserMe', fastifyPreValidationJwt, GetUserMe)

  // SignIn
  fastify.post('/signIn', { schema: SignInSchema }, SignIn)

  // SignUp
  fastify.post('/signUp', { schema: SignUpSchema }, SignUp)

  // Google Auth
  fastify.get('/googleAuth', { schema: GoogleAuthSchema }, GoogleOAuth)
}
