import messages from '@/utils/constants/messages'
import { errorResult } from '@/utils/constants/results'
import { Users } from '@wordigo/db'
import fastify, { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'
import { JwtPayload, verify } from 'jsonwebtoken'

const checkAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
  const { authorization } = request.headers

  if (!authorization) {
    reply.send(errorResult(null, i18next.t(messages.no_authorization)))
    return
  }

  const [bearer, token] = authorization.split(' ')
  console.log(token, process.env['JWT_SECRET'])

  const verifyToken = (await verify(token, process.env['JWT_SECRET'] as string)) as JwtPayload

  if (!verifyToken) {
    reply.send(errorResult(null, i18next.t(messages.wrong_authorization)))
    return
  }

  const user = (await request.server.prisma.users.findFirst({
    where: { id: verifyToken.id },
  })) as Users

  request.user = user
}

export default checkAuthMiddleware
