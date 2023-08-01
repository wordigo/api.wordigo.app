import fastifyPassport from '@fastify/passport'

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

export const authMiddleware = fastifyPassport.authenticate('jwt', { session: false }) as any

export interface IJWTPayload {
  email: string
  id: string
  iat: number
  exp: number
}

export const setupFastifyPassport = () => {
  fastifyPassport.use(
    'jwt',
    new JwtStrategy(jwtConfig, async (jwtPayload: IJWTPayload, done: Function): Promise<void> => {
      try {
        // const user = await UserService.userTokenIsValid(jwtPayload);
        const user = await prisma.users.findFirst({ where: { id: jwtPayload.id } })

        if (!user) {
          return done(null, false)
        }

        return done(null, user)
      } catch (error) {
        done(error)
      }
    })
  )
}
