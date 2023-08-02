import { FastifyInstance } from 'fastify'
import { AddWord, Create, Delete, GetSubscribedList, GetUserDictionaries, GetUserDictionaryById, GetWords, RemoveWord, Subscribe, Update } from './dictionaries.controller'
import {
  AddWordSchema,
  CreateDictionarySchema,
  DeleteDictionarySchema,
  GetSubscribedListSchema,
  GetUserDictionariesSchema,
  GetUserDictionaryByIdSchema,
  GetWordsSchema,
  RemoveWordSchema,
  SubscribeSchema,
  UpdateDictionarySchema,
} from './dictionaries.schema'

export default async (fastify: FastifyInstance) => {
  fastify.post(
    '/create',
    {
      schema: CreateDictionarySchema,
      preValidation: fastify.authVerify,
    },
    Create
  )

  fastify.post(
    '/addWord',
    {
      schema: AddWordSchema,
      preValidation: fastify.authVerify,
    },
    AddWord
  )

  fastify.post(
    '/subscribe',
    {
      schema: SubscribeSchema,
      preValidation: fastify.authVerify,
    },
    Subscribe
  )

  fastify.put(
    '/update',
    {
      schema: UpdateDictionarySchema,
      preValidation: fastify.authVerify,
    },
    Update
  )

  fastify.delete(
    '/delete',
    {
      schema: DeleteDictionarySchema,
      preValidation: fastify.authVerify,
    },
    Delete
  )

  fastify.delete(
    '/removeWord',
    {
      schema: RemoveWordSchema,
      preValidation: fastify.authVerify,
    },
    RemoveWord
  )

  fastify.get(
    '/getUserDictionaries',
    {
      schema: GetUserDictionariesSchema,
      preValidation: fastify.authVerify,
    },
    GetUserDictionaries
  )

  fastify.get(
    '/getUserDictionaryById',
    {
      schema: GetUserDictionaryByIdSchema,
      preValidation: fastify.authVerify,
    },
    GetUserDictionaryById
  )

  fastify.get(
    '/getWords',
    {
      schema: GetWordsSchema,
      preValidation: fastify.authVerify,
    },
    GetWords
  )

  fastify.get(
    '/getSubscribedList',
    {
      schema: GetSubscribedListSchema,
      preValidation: fastify.authVerify,
    },
    GetSubscribedList
  )
}
