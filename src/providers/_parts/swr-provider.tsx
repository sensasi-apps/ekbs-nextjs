'use client'

import { stringify } from 'qs'
// vendors
import { type ReactNode, useEffect, useState } from 'react'
import { SWRConfig } from 'swr'
// components
import LoadingCenter from '@/components/loading-center'
import axios from '@/lib/axios'

/**
 * SWRProvider component that sets up the SWR configuration for the application.
 * It ensures that the SWR configuration is only applied on the client side.
 */
export default function SWRProvider({
    children,
}: {
    children: ReactNode
}): ReactNode {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return <LoadingCenter position="absolute" />

    return (
        <SWRConfig
            value={{
                dedupingInterval: 15000,
                fetcher: fetcher,
                keepPreviousData: true,
                provider: cacheProvider,
                revalidateOnFocus: false,
                shouldRetryOnError: false,
            }}>
            {children}
        </SWRConfig>
    )
}

/**
 * Fetches data from the given endpoint using axios.
 */
async function fetcher(endpointPassed: [string, object] | string) {
    const [endpoint, params] =
        endpointPassed instanceof Array ? endpointPassed : [endpointPassed, {}]

    return axios
        .get(endpoint, {
            params: params,
            paramsSerializer: params => stringify(params),
        })
        .then(res => res.data)
}

/**
 * Provides a cache mechanism using the browser's localStorage.
 *
 * This function initializes a Map object with data from localStorage (if available)
 * and sets up an event listener to save the cache back to localStorage before the window unloads.
 */
function cacheProvider() {
    const map = new Map<string, object>(
        JSON.parse(localStorage.getItem('app-cache') ?? '[]'),
    )

    window.addEventListener('beforeunload', () => {
        let isSuccessful = false

        while (!isSuccessful) {
            const appCache = JSON.stringify(Array.from(map.entries()))

            try {
                localStorage.setItem('app-cache', appCache)
                isSuccessful = true
            } catch {
                const firstKey = map.keys().next().value

                if (firstKey) {
                    map.delete(firstKey)
                }
            }
        }
    })

    return map
}
