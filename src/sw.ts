// types
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
// vendors
import { defaultCache } from '@serwist/next/worker'
import { BackgroundSyncQueue, Serwist } from 'serwist'
import { customCachingStrategies } from './sw/statics/custom-caching-strategies'
import { isBackgroundSyncable } from './sw/functions/is-background-syncable'

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

const queue = new BackgroundSyncQueue('myQueueName')

self.addEventListener('fetch', event => {
    if (!isBackgroundSyncable(event)) {
        return
    }

    queue.pushRequest({ request: event.request })

    event.respondWith(
        new Response(
            JSON.stringify({
                message: 'Request queued for background sync',
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        ),
    )
})

self.addEventListener('message', event => {
    if (event.data.action === 'force-sync') {
        return queue.replayRequests()
    }
})

serwist.addEventListeners()
