// import { PrismaClient } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import messages from '@/utils/constants/messages'
import { successResult } from '@/utils/constants/results'

// const prisma = new PrismaClient()

export async function GetUserMe(request: FastifyRequest, reply: FastifyReply) {
  return reply.send(successResult(request.user, messages.success, messages.success_code))
}
