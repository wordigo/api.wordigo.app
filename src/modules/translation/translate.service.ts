import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import axios from 'axios'
import { AllCountryLanguages } from '../words/words.types'

export const translateApi = axios.create({
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': process.env.RAPID_API_HOST,
  },
})

export const checkingOfLanguages = (nativeLanguage: string, targetLanguage: string) => {
  const doLangsExist = AllCountryLanguages.filter((lang) => {
    return lang.code.toLowerCase() === nativeLanguage.trim().toLowerCase() || lang.code.toLowerCase() === targetLanguage.trim().toLowerCase()
  })

  if (doLangsExist.length !== 2) {
    return errorResult(null, messages.language_not_found)
  }
  return successResult(null, messages.success)
}
