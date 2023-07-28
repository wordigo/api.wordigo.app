import { FastifyInstance } from 'fastify'
import { GetUserMe, Login, GoogleOAuth } from './auth.controller'
import fastifyPassport from '@fastify/passport'
import { GoogleAuthValidation } from './auth.schema'

export const fastifyPreValidationJwt: any = {
  preValidation: fastifyPassport.authenticate('jwt', { session: false }),
}

export default async function (fastify: FastifyInstance) {
  // Get User Me
  fastify.get('/getUserMe', fastifyPreValidationJwt, GetUserMe)

  // Login
  fastify.post('/login', Login)

  fastify.get('/googleAuth', { schema: GoogleAuthValidation }, GoogleOAuth)
}
//ya29.a0AbVbY6MKfuh1fF7Eaf0WPfKpFgF4hcudfrE-Eika5z7v_IkmUQPqHnIfi-TGWgT3SuAY89dEGRKIer1jZFuPfZgDZnZLZqvxog_pY85ENFMNb_qQ4CcrcfPmiS1S20erXYtWLAApUV9yPJKESvGL2V0LsIdRaCgYKAYUSARESFQFWKvPluHnEnLHjOiSyNTBKQ6Cf5g0163
