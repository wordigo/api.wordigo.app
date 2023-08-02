import { FastifyInstance } from 'fastify'
import {
  CreateDictionarySchema,
  DeleteDictionarySchema,
  GetUserDictionariesSchema,
  GetUserDictionaryByIdSchema,
  UpdateDictionarySchema,
  AddWordSchema,
  RemoveWordSchema,
  GetWordsSchema,
  SubscribeSchema,
  GetSubscribedListSchema,
} from './dictionaries.schema'
import {
  Create,
  Delete,
  GetUserDictionaries,
  GetUserDictionaryById,
  Update,
  AddWord,
  RemoveWord,
  GetWords,
  Subscribe,
  GetSubscribedList,
} from './dictionaries.controller'

import { authMiddleware } from '@/lib/fastify-passport'

export default async (fastify: FastifyInstance) => {
  fastify.post(
    '/create',
    {
      schema: CreateDictionarySchema,
      preValidation: authMiddleware,
    },
    Create
  )

  fastify.post(
    '/addWord',
    {
      schema: AddWordSchema,
      preValidation: authMiddleware,
    },
    AddWord
  )

  fastify.post(
    '/subscribe',
    {
      schema: SubscribeSchema,
      preValidation: authMiddleware,
    },
    Subscribe
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

  fastify.delete(
    '/removeWord',
    {
      schema: RemoveWordSchema,
      preValidation: authMiddleware,
    },
    RemoveWord
  )

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

  fastify.get(
    '/getWords',
    {
      schema: GetWordsSchema,
      preValidation: authMiddleware,
    },
    GetWords
  )

  fastify.get(
    '/getSubscribedList',
    {
      schema: GetSubscribedListSchema,
      preValidation: authMiddleware,
    },
    GetSubscribedList
  )
}
