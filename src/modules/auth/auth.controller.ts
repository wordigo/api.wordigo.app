import { FastifyReply, FastifyRequest } from 'fastify'
import { SignInSchema, GoogleAuthSchema, SignUpValidationSchema } from './auth.schema'
import { FromSchema } from 'json-schema-to-ts'
import axios from 'axios'
import { sign } from 'jsonwebtoken'
import { errorResult, successResult } from '../../utils/constants/results'
import messages from '../../utils/constants/messages'
import { PrismaClient } from '@prisma/client'
import { createPasswordHash } from '../../utils/helpers/password.helper'

const prisma = new PrismaClient()

type SignInSchemaType = FromSchema<typeof SignInSchema>
type GoogleAuthSchemaType = FromSchema<typeof GoogleAuthSchema>
type SignUpSchemaType = FromSchema<typeof SignUpValidationSchema>

export async function SignUp(request: FastifyRequest<{ Body: SignUpSchemaType }>, reply: FastifyReply) {
  const { email, password, name, surname } = request.body
  console.log(email, password, name, surname)

  const isEmailExists = await prisma.users.findFirst({
    where: {
      email,
    },
  })
  if (isEmailExists) return reply.send(errorResult(null, messages.user_already_exists, messages.user_already_exists_code))

  const passwordHashAndSalt = await createPasswordHash(password)

  const user = {
    id: '',
    email,
    passwordHash: passwordHashAndSalt.hash,
    passwordSalt: passwordHashAndSalt.salt,
    name,
    surname,
  }

  await prisma.users
    .create({
      data: {
        email,
        name,
        surname,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
      },
    })
    .then((data) => {
      user.id = data.id
    })

  await userMfaModel.create({
    user: user.id,
    mfaTypes: [{ type: MfaEnum.Email }],
  })

  return res.status(HttpStatusCode.Ok).json(successResult(null, messages.success))

  return reply.status(200).send('Hello World')
}

export async function SignIn(request: FastifyRequest<{ Body: SignInSchemaType }>, reply: FastifyReply) {
  return reply.status(200).send('Hello World')
}

// export async function GetUserMe(request: FastifyRequest<{ Body: LoginSchemaType }>, reply: FastifyReply) {
//   return reply.status(200).send('Usser Values')
// }

export const GoogleOAuth = async (request: FastifyRequest<{ Querystring: GoogleAuthSchemaType }>, reply: FastifyReply) => {
  console.log(request.headers)

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
