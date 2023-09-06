import { PrismaClient } from '@prisma/client'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}
