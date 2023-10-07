import { randomUUID } from 'crypto'
import slugify from 'slugify'

import messages from '@/utils/constants/messages'
import { prisma } from '../../lib/prisma'
import i18next from 'i18next'
import { errorResult, successResult } from '@/utils/constants/results'
import { checkingOfLanguages } from '../translation/translate.service'
import { DictionaryInitialTitle } from '../dictionaries/dictionaries.types'
import { LearningStatuses } from '@/utils/constants/enums'

export const create = async (text: string, translatedText: string, nativeLanguage: string, targetLanguage: string, dictionaryId: number, userId: string) => {
    if (nativeLanguage?.trim().toLowerCase() === targetLanguage?.trim().toLowerCase()) return errorResult(null, i18next.t(messages.languages_cant_same))

    let dicFromDb

    if ((dictionaryId as number) > 0) {
        dicFromDb = await prisma.dictionaries.findFirst({
            where: {
                id: dictionaryId,
                authorId: userId,
            },
        })

        if (!dicFromDb) {
            return errorResult(null, i18next.t(messages.dictionary_not_found))
        }
    }

    const doLangsExist = checkingOfLanguages(nativeLanguage as string, targetLanguage as string)

    if (!doLangsExist?.success) return errorResult(null, i18next.t(doLangsExist?.message as string))

    const wordFromDb = await prisma.words.findFirst({
        where: {
            text: text.trim().toLowerCase(),
            translatedText: translatedText.trim().toLowerCase(),
            nativeLanguage: nativeLanguage.trim().toLowerCase(),
            targetLanguage: targetLanguage.trim().toLowerCase(),
        },
    })

    let word
    if (!wordFromDb)
        word = await prisma.words.create({
            data: {
                text: text.trim().toLowerCase(),
                translatedText: translatedText.trim().toLowerCase(),
                nativeLanguage: nativeLanguage.trim().toLowerCase(),
                targetLanguage: targetLanguage.trim().toLowerCase(),
            },
        })
    else word = wordFromDb

    const wordExistInUserWord = await prisma.userWords.findFirst({
        where: {
            authorId: userId,
            wordId: word.id,
        },
    })

    let userWord

    if (wordExistInUserWord) userWord = wordExistInUserWord
    else
        userWord = await prisma.userWords.create({
            data: {
                wordId: word.id,
                learningStatus: LearningStatuses['Not Learned'],
                authorId: userId as string,
            },
        })

    let initialDictionary = await prisma.dictionaries.findFirst({
        where: {
            title: DictionaryInitialTitle,
            authorId: userId,
        },
    })

    if (!initialDictionary) {
        let slug
        while (true) {
            const randomUID = randomUUID().split('-')
            slug = slugify(`${DictionaryInitialTitle}-${randomUID[0]}${randomUID[1]}${randomUID[2]}`, {
                replacement: '-',
                remove: undefined, // remove characters that match regex, defaults to `undefined`
                lower: true,
                strict: false, // strip special characters except replacement, defaults to `false`
                locale: 'vi', // language code of the locale to use
                trim: true,
            })

            const doesSlugExist = await prisma.dictionaries.findFirst({ where: { slug } })
            if (!doesSlugExist) break
        }

        initialDictionary = await prisma.dictionaries.create({
            data: {
                title: DictionaryInitialTitle,
                authorId: userId,
                slug,
            },
        })
    }
    // CHECK IT WORKS OR NOT AND THEN PUBLISH IT
    const dictAndUserWordsExists = await prisma.dictAndUserWords.findFirst({
        where: {
            userWordId: userWord.id,
            dictionaryId: initialDictionary?.id,
        },
    })

    if (!dictAndUserWordsExists)
        await prisma.dictAndUserWords.create({
            data: {
                userWordId: userWord.id,
                dictionaryId: initialDictionary?.id as number,
            },
        })

    if (dictionaryId) {
        const dictExisting = await prisma.dictAndUserWords.findFirst({
            where: {
                userWordId: userWord.id,
                dictionaryId,
            },
        })

        if (!dictExisting)
            await prisma.dictAndUserWords.create({
                data: {
                    userWordId: userWord.id,
                    dictionaryId,
                },
            })
    }

    return successResult(!dicFromDb ? initialDictionary : dicFromDb, i18next.t(messages.success))
}