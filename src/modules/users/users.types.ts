import { Users } from '@prisma/client'

export interface IGoogleUser {
  email?: string | null
  family_name?: string | null
  gender?: string | null
  given_name?: string | null
  hd?: string | null
  id?: string | null
  link?: string | null
  locale?: string | null
  name?: string | null
  picture?: string | null
  verified_email?: boolean | null
}

export interface UpdateUserType {
  user: Users
  username?: string
  name?: string
  password?: string
  provider?: string
  base64Avatar?: string
  nativeLanguage?: string
  targetLanguage?: string
}
