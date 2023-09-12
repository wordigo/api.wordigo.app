import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyEnv from '@fastify/env'
import fastifyHelmet from '@fastify/helmet'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import compressConfig from '@/config/compress.config'
import helmetConfig from '@/config/helmet.config'
import loggerConfig from '@/config/logger.config'
import { swaggerConfig } from '@/config/swagger.config'
import envConfig from '@/lib/env.config'
import corsConfig from '@/config/cors.config'
import prismaPlugin from '@/plugins/prisma.plugin'

import authRoute from '@/modules/auth/auth.routes'
import translateRoute from '@/modules/translation/translate.routes'
import usersRoute from '@/modules/users/users.routes'
import dictionaryRoute from '@/modules/dictionaries/dictionaries.routes'
import publicDictionaryRoute from '@/modules/publicDictionaries/publicDictionaries.routes'
import subscribedUserRoute from '@/modules/subscribedUsers/subscribedUsers.routes'
import wordRoute from '@/modules/words/words.routes'
import userWordRoute from '@/modules/userWords/userWords.routes'
import dashboardRoute from '@/modules/dahboard/dashboard.routes'
import CheckAuthMiddleware from '@/middlewares/auth/checkAuth.middleware'
import { i18next, registeringi18nextMiddleware } from './utils/helpers/i18n.helper'

import path from 'path'

const main = async () => {
  const app = fastify({ logger: loggerConfig })

  await app.register(registeringi18nextMiddleware, { i18next })

  await app.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  })

  app.decorate('authVerify', CheckAuthMiddleware)

  app.addHook('onRequest', (req: FastifyRequest, reply: FastifyReply, done) => {
    const language = req.headers['accept-language']

    if (language === 'tr' || 'tr-TR') {
      i18next.init({ lng: language })
    }
    done()
  })

  app.register(require('@fastify/static'), {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/public/',
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

  // Swagger Docs
  if (app.config.ENABLE_SWAGGER) {
    await app.register(fastifySwagger, swaggerConfig)
    await app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        requestInterceptor: (req) => {
          req.headers['Authorization'] = 'Bearer ' + req.headers.Authorization
          return req
        },
      },
    })
  }

  // API Endpoint routes
  await app.register(
    async (api) => {
      api.register(authRoute, { prefix: '/auth' })
      api.register(usersRoute, { prefix: '/users' })
      api.register(dictionaryRoute, { prefix: '/dictionaries' })
      api.register(publicDictionaryRoute, { prefix: '/publicDictionary' })
      api.register(userWordRoute, { prefix: '/userWords' })
      api.register(wordRoute, { prefix: '/words' })
      api.register(subscribedUserRoute, { prefix: '/subscribedUsers' })
      api.register(translateRoute, { prefix: '/translation' })
      api.register(dashboardRoute, { prefix: '/dashboard' })
    },
    { prefix: '/api/v1' }
  )

  return app
}

export { main }
