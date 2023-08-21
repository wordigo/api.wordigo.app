import messages from '@/utils/constants/messages'
import { errorResult } from '@/utils/constants/results'
import { verifyToken } from '@/utils/helpers/token.helper'
import { Users } from '@wordigo/db'
import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'

const checkAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
  const { authorization } = request.headers

  if (!authorization) {
    reply.send(errorResult(null, i18next.t(messages.unauthorized)))
    return
  }

  const [bearer, token] = authorization.split(' ')

  //const verifyToken = (await verify(token, process.env['JWT_SECRET'] as string)) as JwtPayload
  const verifiedToken = verifyToken(token)

  if (!verifiedToken) {
    reply.send(errorResult(null, i18next.t(messages.unauthorized)))
    return
  }

  const user = (await request.server.prisma.users.findFirst({
    where: { id: verifiedToken },
  })) as Users

  request.user = user
}

export default checkAuthMiddleware
