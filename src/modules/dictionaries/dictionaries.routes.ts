import { FastifyInstance } from 'fastify'
import { AddWord, Create, Delete, GetList, GetUserDictionaries, GetUserDictionaryBySlug, GetWords, RemoveWord, Update, UpdateImage } from './dictionaries.controller'
import {
  AddWordSchema,
  CreateDictionarySchema,
  DeleteDictionarySchema,
  GetListSchema,
  GetUserDictionariesSchema,
  GetUserDictionaryBySlugSchema,
  GetWordsSchema,
  RemoveWordSchema,
  UpdateDictionarySchema,
  UpdateImageSchema,
} from './dictionaries.schema'

export default async (fastify: FastifyInstance) => {
  fastify.post('/create', { schema: CreateDictionarySchema, preValidation: fastify.authVerify }, Create)

  fastify.post('/addWord', { schema: AddWordSchema, preValidation: fastify.authVerify }, AddWord)

  fastify.put('/update', { schema: UpdateDictionarySchema, preValidation: fastify.authVerify }, Update)

  fastify.put('/updateImage', { schema: UpdateImageSchema, preValidation: fastify.authVerify }, UpdateImage)

  fastify.delete('/delete', { schema: DeleteDictionarySchema, preValidation: fastify.authVerify }, Delete)

  fastify.delete('/removeWord', { schema: RemoveWordSchema, preValidation: fastify.authVerify }, RemoveWord)

  fastify.get('/getList', { schema: GetListSchema, preValidation: fastify.authVerify }, GetList)

  fastify.get('/getUserDictionaries', { schema: GetUserDictionariesSchema, preValidation: fastify.authVerify }, GetUserDictionaries)

  fastify.get('/getUserDictionaryBySlug', { schema: GetUserDictionaryBySlugSchema, preValidation: fastify.authVerify }, GetUserDictionaryBySlug)

  fastify.get('/getWords', { schema: GetWordsSchema, preValidation: fastify.authVerify }, GetWords)
}
