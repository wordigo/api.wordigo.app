import { FastifySchema } from 'fastify'
import { tags } from '../../utils/constants/Tags'

// export const GetUserMeValidation = {
//   type: 'object',
//   properties: {
//     authorization: {
//       type: 'string',
//     },
//   },
//   required: ['authorization'],
// } as const satisfies JSONSchema

export const GetUserMeSchema: FastifySchema = {
  // headers: GetUserMeValidation,
  tags: [tags.Users],
  description: 'Get user information',
  security: [{ JWT: [] }],
}
