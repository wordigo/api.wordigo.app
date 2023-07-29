import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyEnv from '@fastify/env'
import fastifyHelmet from '@fastify/helmet'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
//import fastifyPassport from '@fastify/passport'

import compressConfig from './config/compress.config'
import corsConfig from './config/cors.config'
import fastifyCookie from '@fastify/cookie'
import helmetConfig from './config/helmet.config'
import loggerConfig from './config/logger.config'
import { swaggerConfig } from './config/swagger.config'
import envConfig from './lib/env.config'
import fastifySession from '@fastify/session'
import prismaPlugin from './plugins/prisma.plugin'

import authRoute from './modules/auth/auth.route'
import translateRoute from './modules/translate/translate.route'
//import productsRoutes from "./routes/products.routes";
import { messageSchema, paginationSchema, paramIdSchema } from './schema/common.schema'
import { categorySchema, productSchema } from './schema/models.schema'
import jwt from '@fastify/jwt'

const main = async () => {
  const app = fastify({ logger: loggerConfig })

  // Now we setup our app, plugins and such
  await app.register(fastifyEnv, envConfig)
  await app.register(fastifyCors, corsConfig)
  await app.register(fastifyCompress, compressConfig)
  await app.register(fastifyHelmet, helmetConfig)
  await app.register(prismaPlugin)

  app.register(jwt, {
    secret: process.env['JWT_SECRET'] as string,
  })
  app.register(fastifyCookie)

  app.register(fastifySession, {
    secret:
      'denemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedeneme',
    saveUninitialized: false,
  })

  //app.register(fastifyPassport.initialize())
  //app.register(fastifyPassport.secureSession())

  // Json Schemas
  app.addSchema(paginationSchema)
  app.addSchema(paramIdSchema)
  app.addSchema(messageSchema)

  app.addSchema(categorySchema)
  app.addSchema(productSchema)

  // Swagger Docs
  if (app.config.ENABLE_SWAGGER) {
    await app.register(fastifySwagger, swaggerConfig)
    await app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    })
  }

  app.get('/', (req: FastifyRequest, reply: FastifyReply) => {
    reply.send('Hello World')
  })

  // API Endpoint routes
  await app.register(
    async (api) => {
      api.register(authRoute, { prefix: '/auth' })
      api.register(translateRoute, { prefix: '/translation' })
    },
    { prefix: '/api/v1' }
  )

  return app
}

export { main }
