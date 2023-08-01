import { FastifyInstance } from 'fastify'
import {
  CreateDictionarySchema,
  DeleteDictionarySchema,
  GetUserDictionariesSchema,
  GetUserDictionaryByIdSchema,
  UpdateDictionarySchema,
} from './dictionaries.schema'
import {
  Create,
  Delete,
  GetUserDictionaries,
  GetUserDictionaryById,
  Update,
} from './dictionaries.controller'
import fastifyPassport from '@fastify/passport'
import { authMiddleware } from '@/lib/fastify-passport'

export default async (fastify: FastifyInstance) => {
  fastify.get(
    '/getUserDictionaries',
    {
      schema: GetUserDictionariesSchema,
      preValidation: authMiddleware,
    },
    GetUserDictionaries
  )

  fastify.get(
    '/getUserDictionaryById',
    {
      schema: GetUserDictionaryByIdSchema,
      preValidation: authMiddleware,
    },
    GetUserDictionaryById
  )

  fastify.post(
    '/create',
    {
      schema: CreateDictionarySchema,
      preValidation: authMiddleware,
    },
    Create
  )

  fastify.put(
    '/update',
    {
      schema: UpdateDictionarySchema,
      preValidation: authMiddleware,
    },
    Update
  )

  fastify.delete(
    '/delete',
    {
      schema: DeleteDictionarySchema,
      preValidation: authMiddleware,
    },
    Delete
  )
}
