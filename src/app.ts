import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyEnv from '@fastify/env'
import fastifyHelmet from '@fastify/helmet'
import fastify from 'fastify'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import compressConfig from '@/config/compress.config'
import corsConfig from '@/config/cors.config'
import helmetConfig from '@/config/helmet.config'
import loggerConfig from '@/config/logger.config'
import { swaggerConfig } from '@/config/swagger.config'
import envConfig from '@/lib/env.config'
import prismaPlugin from '@/plugins/prisma.plugin'

import fastifyPassport from '@fastify/passport'
import authRoute from '@/modules/auth/auth.route'
import translateRoute from '@/modules/translate/translate.route'
import usersRoute from '@/modules/user/users.route'
import dictionaryRoute from '@/modules/dictionary/dictionaries.route'

const main = async () => {
  const app = fastify({ logger: loggerConfig })

  await app.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '2 minute',
  })

  app.addSchema({
    $id: 'getDicById',
    type: 'object',
    properties: {
      dictionaryId: { type: 'number' },
    },
  })

  // Now we setup our app, plugins and such
  await app.register(fastifyEnv, envConfig)
  await app.register(fastifyCors, corsConfig)
  await app.register(fastifyCompress, compressConfig)
  await app.register(fastifyHelmet, helmetConfig)
  await app.register(prismaPlugin)

  app.register(fastifyCookie)

  app.register(fastifySession, {
    secret: app.config.SESSION_SECRET,
    saveUninitialized: false,
  })

  app.register(fastifyPassport.initialize())
  app.register(fastifyPassport.secureSession())

  // Swagger Docs
  if (app.config.ENABLE_SWAGGER) {
    await app.register(fastifySwagger, swaggerConfig)
    await app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    })
  }

  // API Endpoint routes
  await app.register(
    async (api) => {
      api.register(usersRoute, { prefix: '/users' })
      api.register(authRoute, { prefix: '/auth' })
      api.register(translateRoute, { prefix: '/translation' })
      api.register(dictionaryRoute, { prefix: '/dictionaries' })
    },
    { prefix: '/api/v1' }
  )

  return app
}

export { main }
