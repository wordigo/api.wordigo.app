import { Storage } from '@google-cloud/storage'

export interface UploadingType {
  url?: string
  success: boolean
}

export const uploadImage = (tableName: string, name: string, encodedImage: string) => {
  const storage = new Storage({
    projectId: process.env.CLOUD_PROJECT_ID,
    credentials: {
      type: process.env.CLOUD_STORAGE_TYPE,
      private_key: process.env.CLOUD_STORAGE_PRIVATE_KEY as string,
      client_email: process.env.CLOUD_STORAGE_CLIENT_EMAIL,
      client_id: process.env.CLOUD_STORAGE_CLIENT_ID,
      universe_domain: process.env.CLOUD_STORAGE_UNIVERSE_DOMAIN,
    },
  })

  const bucket = storage.bucket(process.env.CLOUD_STORAGE_BUCKET as string)

  const fileName = `${tableName}_${name}`

  const file = bucket.file(fileName)

  const splittedEncodedImage = encodedImage?.split('base64,')

  const extension = splittedEncodedImage?.[0].split('/')[1].split(';')[0]
  const base64 = splittedEncodedImage?.[1]

  const stream = file.createWriteStream({
    metadata: {
      contentType: `image/${extension}`,
    },
  })

  stream.on('error', async (error) => {
    console.error(error)
    return { url: null, success: false }
  })

  let buffer = Buffer.from(base64 as string, 'base64')

  stream.end(buffer)

  return { url: `https://storage.googleapis.com/${process.env.CLOUD_STORAGE_BUCKET as string}/${fileName}`, success: true }
}
