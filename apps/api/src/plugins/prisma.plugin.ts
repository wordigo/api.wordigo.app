import { prisma } from '@/lib/prisma'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const prismaPlugin: FastifyPluginAsync = fp(async function prismaPlugin(fastify: FastifyInstance) {
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect()
  })
})

export default prismaPlugin
