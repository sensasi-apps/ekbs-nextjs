import ApiUrl from '@/components/pages/marts/products/sales/ApiUrl'
import { RuntimeCaching, StaleWhileRevalidate } from 'serwist'

const SWR_ENDPOINTS = ['/api' + ApiUrl.PRODUCTS, '/api' + ApiUrl.USERS]

/**
 * Custom caching strategies for service worker runtime caching.
 *
 * This array defines specific caching strategies to be used by the service worker.
 * Each strategy includes a matcher function to determine which requests it applies to,
 * and a handler to specify the caching behavior.
 */
export const customCachingStrategies: RuntimeCaching[] = [
    {
        matcher: ({ url }) => SWR_ENDPOINTS.includes(url.pathname),
        handler: new StaleWhileRevalidate(),
    },
]
