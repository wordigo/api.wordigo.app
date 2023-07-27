import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginSchema, GoogleAuthSchema } from './auth.schema'
import { FromSchema } from 'json-schema-to-ts'
import axios from 'axios'
import { sign } from 'jsonwebtoken'
import { successResult } from '../../utils/constants/results'
import messages from '../../utils/messages'

type LoginSchemaType = FromSchema<typeof LoginSchema>
type GoogleAuthSchemaType = FromSchema<typeof GoogleAuthSchema>

export async function Login(request: FastifyRequest<{ Body: LoginSchemaType }>, reply: FastifyReply) {
  return reply.status(200).send('Hello World')
}

export async function GetUserMe(request: FastifyRequest<{ Body: LoginSchemaType }>, reply: FastifyReply) {
  return reply.status(200).send('Usser Values')
}

export const GoogleOAuth = async (request: FastifyRequest<{ Querystring: GoogleAuthSchemaType }>, reply: FastifyReply) => {
  const { accessToken } = request.query

  const googleRequest = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const userData = googleRequest.data
  const token = sign(userData, '9qf7omgyBzJia0kgBpPUnJhW3Lh07ZXOI6IrwIV0EsnB2rU2Fw')

  return reply.send(successResult(token, messages.success, messages.success_code))
}
