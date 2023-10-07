import { create as createDic } from '@/modules/dictionaries/dictionaries.service'
import { create as createWord } from '@/modules/words/words.service'
import * as fs from 'fs'
import { Dictionaries, prisma } from '../src/lib/prisma'
import messages from '@/utils/constants/messages'

export const promptJsonPath = '/prompt.json'

interface WordObject {
    text: string
    translatedText: string
    nativeLanguage: string
    targetLanguage: string
}

export interface Prompt {
    titleOfDic: string,
    nativeLanguage: string,
    targetLanguage: string,
    words: WordObject[]
}

export default async () => {

    let prompt: Prompt

    fs.readFile(__dirname + promptJsonPath, 'utf8', async (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err)
            return
        }

        try {
            prompt = JSON.parse(data) as Prompt

            const user = await prisma.users.findFirst(
                {
                    where: {
                        email: 'user@example.com'
                    }
                })

            if (!user)
                return console.error(messages.user_not_found)

            const createDicResult = await createDic(prompt.titleOfDic, prompt.targetLanguage, prompt.nativeLanguage, true, user?.id as string)
            if (!createDicResult.success)
                return console.error(createDicResult.message)

            const dictionary = createDicResult.data as Dictionaries

            const words = prompt.words

            for (const word of words) {
                await createWord(word.text, word.translatedText, word.nativeLanguage, word.targetLanguage, dictionary.id as number, user.id)
            }

        } catch (err) {
            console.error("Error parsing JSON data:", err)
            return
        }
    })
}