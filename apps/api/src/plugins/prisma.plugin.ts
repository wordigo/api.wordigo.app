import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { prisma } from '@wordigo/db'

const prismaPlugin: FastifyPluginAsync = fp(async function prismaPlugin(fastify: FastifyInstance) {
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect()
  })
})

export default prismaPlugin
