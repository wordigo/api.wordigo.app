import { join } from 'path'
import { readdirSync, lstatSync } from 'fs'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import i18nextMiddleware from 'i18next-http-middleware'

const localesFolder = join(__dirname, '../../../locales')

const pathsOfLanguages: string[] = []

i18next
  .use(i18nextMiddleware.LanguageDetector) // the language detector, will automatically detect the users language, by some criteria... like the query parameter ?lng=en or http header, etc...
  .use(Backend) // you can also use any other i18next backend, like i18next-http-backend or i18next-locize-backend
  .init({
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    fallbackLng: 'en',
    preload: readdirSync(localesFolder).filter((fileName) => {
      const joinedPath = join(localesFolder, fileName)
      pathsOfLanguages.push(fileName.split('.')[0])
      return lstatSync(joinedPath).isDirectory()
    }),
    backend: {
      loadPath: join(localesFolder, '{{lng}}.json'),
    },
  })

export const registeringi18nextMiddleware = async (app: any) => {
  app.register(i18nextMiddleware.plugin, { i18next })
}

export { i18next, pathsOfLanguages }
