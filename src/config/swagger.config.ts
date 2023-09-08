import { SwaggerOptions } from '@fastify/swagger'

const httpOption = process.env.TS_NODE_DEV ? 'https' : 'http'

export const swaggerConfig: SwaggerOptions = {
  swagger: {
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter your JWT token in the format **&lt;token>**',
      },
    },
    info: {
      title: 'Wordigo Swagger',
      description: 'Swagger Gateway of Wordigo',
      version: '0.0.1',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    schemes: [httpOption],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
}
