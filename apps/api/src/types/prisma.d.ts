import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@wordigo/db'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}
