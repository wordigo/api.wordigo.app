import { PrismaClient } from '@wordigo/db'
import { UpdateUserType } from './users.types'
import { UploadingType, uploadImage } from '../../utils/helpers/fileUploading.helper'
import messages from '../../utils/constants/messages'
import { errorResult, successResult } from '../../utils/constants/results'

const prisma = new PrismaClient()

export const Update = async (updatingProps: UpdateUserType) => {
  const { user, base64Avatar, username, name } = updatingProps

  let returnType: any

  //update methodlogy needs to be updated, current version of update is not powerful in the way of performance

  if (base64Avatar && base64Avatar.length > 0) {
    const resultOfUploading: UploadingType = uploadImage('user', user.username as string, base64Avatar as string)
    if (!resultOfUploading.success) {
      return errorResult(null, messages.uploading_file)
    }

    const avatar_url = resultOfUploading.url as string

    if (resultOfUploading) {
      returnType = { ...returnType, avatar_url }
    }
  }

  if (username && username.length > 0) {
    const existingOfUsername = await prisma.users.findFirst({ where: { username } })

    if (existingOfUsername) {
      return errorResult(null, messages.username_exists)
    }

    returnType = { ...returnType, username }
  }

  if (name && name.length > 0) returnType = { ...returnType, name }

  await prisma.users.update({ data: { ...returnType }, where: { id: user.id } })

  return successResult(returnType, messages.success)
}
