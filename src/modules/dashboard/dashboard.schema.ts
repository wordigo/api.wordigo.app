import { tags } from '../../utils/constants/Tags'

export const GeneralStatisticSchema = {
  tags: [tags.Dashboard],
  summary: 'General Statistic of User',
  description: "Number of Datas User Have",
  security: [{ JWT: [] }],
}

export const WordInteractionSchema = {
  tags: [tags.Dashboard],
  summary: 'Word Interactions of User',
  description: "Time Based Statictis of Word Adding/Creating of User",
  security: [{ JWT: [] }],
}
