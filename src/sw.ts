// types
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
// vendors
import { defaultCache } from '@serwist/next/worker'
import { Serwist } from 'serwist'
import { customCachingStrategies } from './sw/statics/custom-caching-strategies'
// locals
import { handleMessage } from './sw/functions/handle-message'
import { handleFetch } from './sw/functions/handle-fetch'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
    }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    disableDevLogs: true,
    runtimeCaching: [...customCachingStrategies, ...defaultCache],
})

self.addEventListener('fetch', handleFetch)

self.addEventListener('message', handleMessage)

serwist.addEventListeners()
