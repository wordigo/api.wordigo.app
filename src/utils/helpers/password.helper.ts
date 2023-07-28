import { pbkdf2Sync, randomBytes } from 'crypto'

const iterations = 1000
const keyLength = 64
const hashAlgorithm = 'sha512'

export const createPasswordHash = async (password: string) => {
  const salt = randomBytes(16).toString('hex')

  const hash = pbkdf2Sync(password, salt, iterations, keyLength, hashAlgorithm).toString('hex')

  return { hash, salt }
}

export const verifyPasswordHash = async (password: string, hashFromDb: string, saltFromDb: string) => {
  const hash = pbkdf2Sync(password, saltFromDb, iterations, keyLength, hashAlgorithm).toString('hex')

  if (hash === hashFromDb) return true
  else return false
}
