import { Users } from '@prisma/client'
import { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: Users
  }
  interface FastifyInstance {
    config: {
      PORT: number
      NODE_ENV: 'development' | 'production' | 'test'
      SESSION_SECRET: string
      JWT_SECRET: string
      BIND_ADDR: string
      PROJECT_NAME: string
      APP_SERVER_NAME: string
      DATABASE_URL: string
      ENABLE_SWAGGER: string
    }
  }
}
