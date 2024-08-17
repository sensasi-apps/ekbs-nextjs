import type { AuthInfo } from '@/dataTypes/User'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import { KeyedMutator } from 'swr'

export default async function logout(mutate: KeyedMutator<AuthInfo | null>) {
    await unsetUserCache()
    await axios.post<undefined>('/logout').catch((error: AxiosError) => {
        const isNetworkError = error.code === AxiosError.ERR_NETWORK
        const isUnauthenticated =
            error.response?.status &&
            [
                401, // Unauthorized (user is not logged in)
                419, // CSRF token mismatch
            ].includes(error.response.status)

        if (!isNetworkError && !isUnauthenticated) {
            return Promise.reject(error)
        }
    })

    mutate(null).catch(() => null)
}

async function unsetUserCache() {
    const cacheStorage = await caches.open('cross-origin')

    const cacheKey = await cacheStorage
        .keys()
        .then(keys =>
            keys.find(
                key =>
                    key.url ===
                    process.env.NEXT_PUBLIC_BACKEND_URL + '/api/user',
            ),
        )

    if (cacheKey) {
        cacheStorage.put(
            cacheKey,
            new Response(null, {
                status: 401,
                statusText: 'Unauthenticated',
            }),
        )
    }
}
