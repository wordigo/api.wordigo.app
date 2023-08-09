import { FastifyInstance } from 'fastify'
import { AddWord, Create, Delete, GetList, GetPublicDictionaries, GetUserDictionaries, GetUserDictionary, GetWords, RemoveWord, Subscribe, Unsubscribe, Update } from './dictionaries.controller'
import {
  AddWordSchema,
  CreateDictionarySchema,
  DeleteDictionarySchema,
  GetListSchema,
  GetPublicDictionariesSchema,
  GetUserDictionariesSchema,
  GetUserDictionarySchema,
  GetWordsSchema,
  RemoveWordSchema,
  SubscribeSchema,
  UnsubscribeSchema,
  UpdateDictionarySchema,
} from './dictionaries.schema'

export default async (fastify: FastifyInstance) => {
  fastify.post('/create', { schema: CreateDictionarySchema, preValidation: fastify.authVerify }, Create)

  fastify.post('/addWord', { schema: AddWordSchema, preValidation: fastify.authVerify }, AddWord)

  fastify.post('/subscribe', { schema: SubscribeSchema, preValidation: fastify.authVerify }, Subscribe)

  fastify.post('/unsubscribe', { schema: UnsubscribeSchema, preValidation: fastify.authVerify }, Unsubscribe)

  fastify.put('/update', { schema: UpdateDictionarySchema, preValidation: fastify.authVerify }, Update)

  fastify.delete('/delete', { schema: DeleteDictionarySchema, preValidation: fastify.authVerify }, Delete)

  fastify.delete('/removeWord', { schema: RemoveWordSchema, preValidation: fastify.authVerify }, RemoveWord)

  fastify.get('/getList', { schema: GetListSchema, preValidation: fastify.authVerify }, GetList)

  fastify.get('/getUserDictionaries', { schema: GetUserDictionariesSchema, preValidation: fastify.authVerify }, GetUserDictionaries)

  fastify.get('/getUserDictionary', { schema: GetUserDictionarySchema, preValidation: fastify.authVerify }, GetUserDictionary)

  fastify.get('/getWords', { schema: GetWordsSchema, preValidation: fastify.authVerify }, GetWords)

  fastify.get('/getPublicDictionaries', { schema: GetPublicDictionariesSchema, preValidation: fastify.authVerify }, GetPublicDictionaries)
}
