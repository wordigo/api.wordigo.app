import messages from '@/utils/constants/messages'
import { AllCountryLanguages } from '../words/words.types'
import i18next from 'i18next'
import { errorResult } from '@/utils/constants/results'

export const options = {
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': process.env.RAPID_API_HOST,
  },
}

export const checkingOfLanguages = (nativeLanguage: string, targetLanguage: string) => {
  const doLangsExist = AllCountryLanguages.filter((lang) => {
    return lang.code.toLowerCase() === nativeLanguage.trim().toLowerCase() || lang.code.toLowerCase() === targetLanguage.trim().toLowerCase()
  })

  if (doLangsExist.length !== 2) {
    return errorResult(null, messages.language_not_found)
  }
}
