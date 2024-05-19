import messages from '@/utils/constants/messages'
import { errorResult, successResult } from '@/utils/constants/results'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { AllCountryLanguages } from '../words/words.types'

export const translateApi = axios.create({
  baseURL: 'https://api.cognitive.microsofttranslator.com',
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATE_API_KEY,
    // location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': process.env.AZURE_RESOURCE_LOCATION,
    'Content-type': 'application/json',
    'X-ClientTraceId': uuidv4().toString(),
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
