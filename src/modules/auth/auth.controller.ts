import { FastifyReply, FastifyRequest } from 'fastify'
import {
  SignUpValidationSchema,
  GoogleAuthValidationSchema,
  SignInValidationSchema,
} from './auth.schema'
import { FromSchema } from 'json-schema-to-ts'
import axios, { HttpStatusCode } from 'axios'
import { sign } from 'jsonwebtoken'
import { errorResult, successResult } from '@/utils/constants/results'
import messages from '@/utils/constants/messages'
import { PrismaClient } from '@prisma/client'
import { createPasswordHash, verifyPasswordHash } from '@/utils/helpers/password.helper'
import { Providers } from '@/utils/constants/enums'
import { IGoogleUser } from './auth.types'

const prisma = new PrismaClient()

type SignInSchemaType = FromSchema<typeof SignInValidationSchema>
type GoogleAuthValidationSchemaType = FromSchema<typeof GoogleAuthValidationSchema>
type SignUpSchemaType = FromSchema<typeof SignUpValidationSchema>

export async function SignUp(
  request: FastifyRequest<{ Body: SignUpSchemaType }>,
  reply: FastifyReply
) {
  const { email, password, name, surname } = request.body

  const isEmailExists = await prisma.users.findFirst({
    where: {
      email,
    },
  })
  if (isEmailExists)
    return reply.send(
      errorResult(null, messages.user_already_exists, messages.user_already_exists_code)
    )

  const passwordHashAndSalt = await createPasswordHash(password)

  await prisma.users.create({
    data: {
      email,
      name,
      surname,
      passwordHash: passwordHashAndSalt.hash,
      passwordSalt: passwordHashAndSalt.salt,
      provider: Providers.Local,
    },
  })

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export async function SignIn(
  request: FastifyRequest<{ Body: SignInSchemaType }>,
  reply: FastifyReply
) {
  const { email, password } = request.body

  const user = await prisma.users.findFirst({ where: { email } })

  if (!user)
    return reply.send(errorResult(null, messages.user_not_found, messages.user_not_found_code))
  else if (user?.provider === Providers.Google)
    return reply
      .status(HttpStatusCode.Unauthorized)
      .send(
        errorResult(null, messages.user_signed_dif_provider, messages.user_signed_dif_provider_code)
      )

  const passwordVerification = await verifyPasswordHash(
    password,
    user?.passwordHash as string,
    user?.passwordSalt as string
  )

  if (!passwordVerification)
    return reply
      .status(HttpStatusCode.Unauthorized)
      .send(errorResult(null, messages.user_wrong_password, messages.user_wrong_password_code))

  const token = sign({ email: user.email, id: user.id }, process.env['JWT_SECRET'] as string, {
    expiresIn: '1h',
  })

  return reply.send(successResult({ token }, messages.success, messages.success_code))
}

export const GoogleOAuth = async (
  request: FastifyRequest<{ Querystring: GoogleAuthValidationSchemaType }>,
  reply: FastifyReply
) => {
  const { accessToken } = request.query

  const googleRequest = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const googleUser = googleRequest.data as IGoogleUser

  let user = await prisma.users.findFirst({
    where: {
      email: googleUser.email as string,
    },
  })

  if (!user)
    user = await prisma.users.create({
      data: {
        email: googleUser.email as string,
        name: googleUser.email as string,
        surname: googleUser.email as string,
        provider: Providers.Google,
      },
    })
  else if (user.provider === Providers.Local)
    return reply.send(
      errorResult(null, messages.user_signed_dif_provider, messages.user_signed_dif_provider_code)
    )

  const token = sign({ email: user.email, id: user.id }, process.env['JWT_SECRET'] as string, {
    expiresIn: '1h',
  })

  return reply.send(successResult(token, messages.success, messages.success_code))
}
