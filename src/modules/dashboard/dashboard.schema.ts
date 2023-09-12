import { tags } from '../../utils/constants/Tags'

export const GetSchema = {
  tags: [tags.Dashboard],
  summary: 'Wordigo User Dashboard',
  security: [{ JWT: [] }],
}
