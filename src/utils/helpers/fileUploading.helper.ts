import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export interface UploadingType {
  url?: string | null
  success: boolean | null
}

// AWS.config.update({
//   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
//   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
//   region: process.env.AWS_S3_REGION as string,
// })

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
})

export const uploadImage = (tableName: string, name: string, encodedImage: string): Promise<UploadingType> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME as string
  const fileName = `${tableName}/${name}`

  const splittedEncodedImage = encodedImage?.split('base64,')

  const extension = splittedEncodedImage?.[0].split('/')[1].split(';')[0]
  const base64 = splittedEncodedImage?.[1]

  const paramsForUpload = {
    Bucket: bucketName,
    Key: `${fileName}.${extension}`,
    Body: Buffer.from(base64 as string, 'base64'),
    ContentType: `image/${extension}`,
  }

  const putCommand = new PutObjectCommand(paramsForUpload)

  // s3.send(putCommand).catch((err) => {
  //   console.log(err)
  // })

  return new Promise<UploadingType>((resolve, reject) => {
    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to 'await client.upload(params, options).promise()', and re-run aws-sdk-js-codemod.
    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to 'await client.upload(params, options).promise()', and re-run aws-sdk-js-codemod.
    s3.send(putCommand, (err: any, data: any) => {
      if (err) {
        //reject({ url: '', success: false } as UploadingType)
        resolve({ url: null, success: false } as UploadingType)
      } else {
        resolve({ url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${tableName}/${name}.${extension}`, success: true } as UploadingType)
      }
    })
  })
}

// import { Storage } from '@google-cloud/storage'

// export interface UploadingType {
//   url?: string
//   success: boolean
// }

// export const uploadImage = (tableName: string, name: string, encodedImage: string) => {
//   const storage = new Storage({
//     projectId: process.env.CLOUD_PROJECT_ID,
//     credentials: {
//       type: process.env.CLOUD_STORAGE_TYPE,
//       private_key: process.env.CLOUD_STORAGE_PRIVATE_KEY as string,
//       client_email: process.env.CLOUD_STORAGE_CLIENT_EMAIL,
//       client_id: process.env.CLOUD_STORAGE_CLIENT_ID,
//       universe_domain: process.env.CLOUD_STORAGE_UNIVERSE_DOMAIN,
//     },
//   })

//   const bucket = storage.bucket(process.env.CLOUD_STORAGE_BUCKET as string)

//   const fileName = `${tableName}_${name}`

//   const file = bucket.file(fileName)

//   const splittedEncodedImage = encodedImage?.split('base64,')

//   const extension = splittedEncodedImage?.[0].split('/')[1].split(';')[0]
//   const base64 = splittedEncodedImage?.[1]

//   const stream = file.createWriteStream({
//     metadata: {
//       contentType: `image/${extension}`,
//     },
//   })

//   stream.on('error', async (error) => {
//     console.error(error)
//     return { url: null, success: false }
//   })

//   let buffer = Buffer.from(base64 as string, 'base64')

//   stream.end(buffer)

//   return { url: `https://storage.googleapis.com/${process.env.CLOUD_STORAGE_BUCKET as string}/${fileName}`, success: true }
// }
