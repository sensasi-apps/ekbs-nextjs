// types

// vendors
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { NetworkOnly, Serwist } from 'serwist'
import { handleFetch } from './sw/functions/handle-fetch'
// locals
import { handleMessage } from './sw/functions/handle-message'

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
    clientsClaim: true,
    disableDevLogs: true,
    navigationPreload: true,
    precacheEntries: self.__SW_MANIFEST,
    precacheOptions: {
        cleanupOutdatedCaches: true,
    },
    runtimeCaching: [
        ...defaultCache,
        {
            handler: new NetworkOnly(),
            matcher: ({ url }) => url.pathname.startsWith('/oauth/'),
        },
    ],
    skipWaiting: true,
})

self.addEventListener('fetch', handleFetch, { passive: true })

self.addEventListener('message', handleMessage, { passive: true })

serwist.addEventListeners()
