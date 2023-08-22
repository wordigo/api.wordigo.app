import { FastifyReply, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import axios, { HttpStatusCode } from 'axios'
import { sign } from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import slugify from 'slugify'
import i18next from 'i18next'
import Resend, { renderEmail } from '@wordigo/email'

import { SignUpValidation, GoogleAuthValidation, SignInValidation } from './auth.schema'
import { IGoogleUser } from './auth.types'
import { createPasswordHash, verifyPasswordHash } from '@/utils/helpers/password.helper'
import { createToken } from '@/utils/helpers/token.helper'
import { errorResult, successResult } from '@/utils/constants/results'
import messages from '@/utils/constants/messages'
import { Providers } from '@/utils/constants/enums'
import { pathsOfLanguages } from '@/utils/helpers/i18n.helper'

type SignInValidationType = FromSchema<typeof SignInValidation>
type GoogleAuthValidationType = FromSchema<typeof GoogleAuthValidation>
type SignUpValidationType = FromSchema<typeof SignUpValidation>

export const SignUp = async (req: FastifyRequest<{ Body: SignUpValidationType }>, reply: FastifyReply) => {
  const { email, password, name } = req.body
  const prisma = req.server.prisma

  const isEmailExists = await req.server.prisma.users.findFirst({
    where: {
      email,
    },
  })
  if (isEmailExists) return reply.send(errorResult(null, i18next.t(messages.user_already_exists)))

  const passwordHashAndSalt = await createPasswordHash(password)

  let username

  while (true) {
    const randomUID = randomUUID().split('-')
    username = slugify(`${name}-${randomUID[0]}${randomUID[1]}${randomUID[2]}`, {
      replacement: '-',
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true,
    })

    const doesUserNameExist = await prisma.users.findFirst({ where: { username } })
    if (!doesUserNameExist) {
      break
    }
  }

  let nativeLanguage = i18next.language

  if (!pathsOfLanguages.includes(nativeLanguage)) {
    nativeLanguage = 'en'
  }

  await Resend.emails.send({
    from: 'noreply@wordigo.app',
    to: email,
    subject: i18next.t('welcome_user'),
    react: renderEmail({ type: 'welcome', language: nativeLanguage as string, props: { name } }),
  })

  await prisma.users.create({
    data: {
      avatar_url: `https://wordigo.app/api/dynamic-avatar?username=${username}?size=256`,
      email,
      name,
      username,
      passwordHash: passwordHashAndSalt.hash,
      passwordSalt: passwordHashAndSalt.salt,
      nativeLanguage,
      provider: Providers.Local,
    },
  })

  return reply.send(successResult(null, i18next.t(messages.success)))
}

export const SignIn = async (req: FastifyRequest<{ Body: SignInValidationType }>, reply: FastifyReply) => {
  const { email, username, password } = req.body

  const user = await req.server.prisma.users.findFirst({ where: { OR: [{ email, username }] } })

  if (!user) {
    return reply.send(errorResult(null, i18next.t(messages.user_not_found)))
  } else if (user?.provider === Providers.Google) {
    return reply.status(HttpStatusCode.Unauthorized).send(errorResult(null, i18next.t(messages.user_signed_dif_provider)))
  }

  const passwordVerification = await verifyPasswordHash(password, user?.passwordHash as string, user?.passwordSalt as string)

  if (!passwordVerification) return reply.status(HttpStatusCode.Unauthorized).send(errorResult(null, i18next.t(messages.user_wrong_password)))

  const token = createToken(user.id)

  return reply.send(successResult({ user, accessToken: token }, i18next.t(messages.success)))
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

  const username = slugify(`${googleUser.name}-${randomUUID()}`, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })

  if (!user)
    user = await request.server.prisma.users.create({
      data: {
        email: googleUser.email as string,
        name: googleUser.name as string,
        username,
        avatar_url: googleUser.picture,
        nativeLanguage: googleUser.locale,
        provider: Providers.Google,
      },
    })
  else if (user.provider === Providers.Local) return reply.send(errorResult(null, i18next.t(messages.user_signed_dif_provider)))

  const token = sign({ email: user.email, id: user.id }, process.env['JWT_SECRET'] as string, {
    expiresIn: '1h',
  })

  return reply.send(successResult({ token, user }, i18next.t(messages.success)))
}
