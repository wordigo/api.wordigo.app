import { SwaggerOptions } from '@fastify/swagger'

export const swaggerConfig: SwaggerOptions = {
  swagger: {
    securityDefinitions: {
      Authorization: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
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
    schemes: ['http', 'https'], // Both HTTP and HTTPS are supported
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'categories', description: 'Category related end-points' },
      { name: 'products', description: 'Product related end-points' },
    ],
  },
}
