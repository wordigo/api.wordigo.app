import { JSONSchema } from 'json-schema-to-ts'
import { tags } from '../../utils/constants/Tags'
import { TypesOfStatistic } from './dashboard.types'

export const GeneralStatisticSchema = {
  tags: [tags.Dashboard],
  summary: 'General Statistic of User',
  description: "Number of Datas User Have",
  security: [{ JWT: [] }],
}

// export const WordInteractionValidation = {
//   type: 'object',
//   properties: {
//     typeOfStatistic: {
//       type: 'string',
//       enum: [TypesOfStatistic.daily, TypesOfStatistic.weekly, TypesOfStatistic.monthly],
//     },
//   },
//   required: ['typeOfStatistic'],
// } as const satisfies JSONSchema

export const WordInteractionSchema = {
  //querystring: WordInteractionValidation,
  tags: [tags.Dashboard],
  summary: 'Word Interactions of User',
  description: "Last 30 Days Statictis of Word Adding/Creating of User",
  security: [{ JWT: [] }],
}
