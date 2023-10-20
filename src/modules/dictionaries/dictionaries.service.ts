import slugify from 'slugify'
import { randomUUID } from 'crypto'

import { prisma } from '../../lib/prisma'
import i18next from 'i18next'
import { DictionaryInitialTitle } from './dictionaries.types'
import messages from '../../utils/constants/messages'
import { errorResult, successResult } from '../../utils/constants/results'
import { checkingOfLanguages } from '../translation/translate.service'

export const create = async (title: string, targetLang: string, sourceLang: string, description: string, level: number, published: boolean, userId: string) => {
    if (title && title.trim().toLowerCase() === DictionaryInitialTitle) return errorResult(null, i18next.t(messages.dictionary_already_exists))

    const dicFromDb = await prisma.dictionaries.findFirst({ where: { title: title.trim().toLowerCase() } })
    if (dicFromDb)
        return errorResult(null, i18next.t(messages.dictionary_already_exists))

    if (sourceLang && targetLang) {
        const doLangsExist = checkingOfLanguages(sourceLang as string, targetLang as string)

        if (!doLangsExist?.success) return errorResult(null, i18next.t(doLangsExist?.message as string))
    }

    let slug: string
    while (true) {
        const randomUID = randomUUID().split('-')
        slug = slugify(`${title}-${randomUID[0]}${randomUID[1]}${randomUID[2]}`, {
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

    const newDictionary = await prisma.dictionaries.create({
        data: {
            title: title.trim().toLowerCase(),
            authorId: userId,
            slug,
            targetLang,
            sourceLang,
            published,
            description,
            level
        },
    })

    return successResult(newDictionary, i18next.t(messages.success))
}