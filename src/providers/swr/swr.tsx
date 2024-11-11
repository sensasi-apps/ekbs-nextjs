import { useEffect, useState, type ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { fetcher } from './functions/fetcher'
import { cacheProvider } from './functions/cache-provider'

/**
 * SWRProvider component that sets up the SWR configuration for the application.
 * It ensures that the SWR configuration is only applied on the client side.
 */
export function SWRProvider({ children }: { children: ReactNode }): ReactNode {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return children

    return (
        <SWRConfig
            value={{
                fetcher: fetcher,
                provider: cacheProvider,
                dedupingInterval: 5000,
                shouldRetryOnError: false,
                revalidateOnFocus: false,
                keepPreviousData: true,
            }}>
            {children}
        </SWRConfig>
    )
}
