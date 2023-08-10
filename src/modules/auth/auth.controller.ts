import { FastifyReply, FastifyRequest } from 'fastify'
import { SignUpValidation, GoogleAuthValidation, SignInValidation } from './auth.schema'
import { FromSchema } from 'json-schema-to-ts'
import axios, { HttpStatusCode } from 'axios'
import { sign } from 'jsonwebtoken'
import { errorResult, successResult } from '@/utils/constants/results'
import messages from '@/utils/constants/messages'
import { PrismaClient } from '@prisma/client'
import { createPasswordHash, verifyPasswordHash } from '@/utils/helpers/password'
import { Providers } from '@/utils/constants/enums'
import { IGoogleUser } from './auth.types'
import { randomUUID } from 'crypto'
import slugify from 'slugify'

const prisma = new PrismaClient()

type SignInValidationType = FromSchema<typeof SignInValidation>
type GoogleAuthValidationType = FromSchema<typeof GoogleAuthValidation>
type SignUpValidationType = FromSchema<typeof SignUpValidation>

export const SignUp = async (request: FastifyRequest<{ Body: SignUpValidationType }>, reply: FastifyReply) => {
  const { email, password, name } = request.body

  const isEmailExists = await request.server.prisma.users.findFirst({
    where: {
      email,
    },
  })
  if (isEmailExists) return reply.send(errorResult(null, messages.user_already_exists, messages.user_already_exists_code))

  const passwordHashAndSalt = await createPasswordHash(password)

  const username = slugify(`${name}-${randomUUID()}`, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })

  const avatarName = slugify(name, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })

  await prisma.users.create({
    data: {
      avatar_url: `https://wordigo.app/api/dynamic-avatar?username=${avatarName}?size=256`,
      email,
      name,
      username,
      passwordHash: passwordHashAndSalt.hash,
      passwordSalt: passwordHashAndSalt.salt,
      provider: Providers.Local,
    },
  })

  return reply.send(successResult(null, messages.success, messages.success_code))
}

export const SignIn = async (request: FastifyRequest<{ Body: SignInValidationType }>, reply: FastifyReply) => {
  const { email, password } = request.body

  const user = await request.server.prisma.users.findFirst({ where: { email } })

  if (!user) return reply.send(errorResult(null, messages.user_not_found, messages.user_not_found_code))
  else if (user?.provider === Providers.Google)
    return reply
      .status(HttpStatusCode.Unauthorized)
      .send(errorResult(null, messages.user_signed_dif_provider, messages.user_signed_dif_provider_code))

  const passwordVerification = await verifyPasswordHash(password, user?.passwordHash as string, user?.passwordSalt as string)

  if (!passwordVerification)
    return reply.status(HttpStatusCode.Unauthorized).send(errorResult(null, messages.user_wrong_password, messages.user_wrong_password_code))

  const token = sign({ email: user.email, id: user.id }, process.env['JWT_SECRET'] as string, {
    expiresIn: '3d',
  })

  return reply.send(successResult({ user, accessToken: token }, messages.success, messages.success_code))
}

export const GoogleOAuth = async (request: FastifyRequest<{ Querystring: GoogleAuthValidationType }>, reply: FastifyReply) => {
  const { accessToken } = request.query

  const googleRequest = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const googleUser = googleRequest.data as IGoogleUser

  let user = await request.server.prisma.users.findFirst({
    where: {
      email: googleUser.email as string,
    },
  })

  if (!user)
    user = await request.server.prisma.users.create({
      data: {
        email: googleUser.email as string,
        name: googleUser.name as string,
        surname: googleUser.name as string,
        avatar_url: googleUser.picture,
        nativeLanguage: googleUser.locale,
        provider: Providers.Google,
      },
    })
  else if (user.provider === Providers.Local)
    return reply.send(errorResult(null, messages.user_signed_dif_provider, messages.user_signed_dif_provider_code))

  const token = sign({ email: user.email, id: user.id }, process.env['JWT_SECRET'] as string, {
    expiresIn: '1h',
  })

  return reply.send(successResult(token, messages.success, messages.success_code))
}
