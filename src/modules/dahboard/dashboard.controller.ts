import { FastifyReply, FastifyRequest } from 'fastify'
import i18next from 'i18next'

import messages from '../../utils/constants/messages'
import { successResult } from '../../utils/constants/results'

export const Get = async (request: FastifyRequest, reply: FastifyReply) => {
  /*
user's number of dictionaries
user's number of words
user's number of public dictionaries
user's number of subbed dictionaries
*/
  return reply.send(successResult(null, i18next.t(messages.success)))
}
