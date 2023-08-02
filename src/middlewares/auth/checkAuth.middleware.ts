import messages from '@/utils/constants/messages'
import { errorResult } from '@/utils/constants/results'
import { Users } from '@prisma/client'
import fastify, { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest, PassportUser } from 'fastify'
import { JwtPayload, verify } from 'jsonwebtoken'

const checkAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
  const { authorization } = request.headers

  if (!authorization) {
    reply.send(errorResult(null, messages.no_authorization, messages.no_authorization_code))
    return
  }

  const [bearer, token] = authorization.split(' ')
  console.log(token, process.env['JWT_SECRET'])

  const verifyToken = (await verify(token, process.env['JWT_SECRET'] as string)) as JwtPayload

  if (!verifyToken) {
    reply.send(errorResult(null, messages.wrong_authorization, messages.wrong_authorization_code))
    return
  }

  const user = (await request.server.prisma.users.findFirst({
    where: { id: verifyToken.id },
  })) as Users

  request.user = user
}

export default checkAuthMiddleware
