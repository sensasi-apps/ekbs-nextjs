// import ApiUrl from '@/components/pages/marts/products/sales/ApiUrl'

const ENDPOINT_PATHS = [
    'fitur-belum-aktif',
    // '/api/' + ApiUrl.STORE
]

/**
 * Determines if a fetch event is eligible for background synchronization.
 *
 * This function checks if the request method is 'POST' and if the request URL's
 * pathname is included in the predefined list of endpoint paths.
 *
 * @param event - The fetch event to evaluate.
 * @returns `true` if the fetch event is syncable in the background, otherwise `false`.
 */
export function isBackgroundSyncable(event: FetchEvent): boolean {
    const requestUrl = new URL(event.request.url)

    return (
        event.request.method === 'POST' &&
        ENDPOINT_PATHS.includes(requestUrl.pathname)
    )
}
