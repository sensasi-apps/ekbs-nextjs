import ApiUrl from '@/app/mart-product-sales/_parts/enums/api-url'
import { martSales } from '@/sw/statics/bg-sync-queue-instances/mart-sales'

/**
 * Enum representing various endpoints for Mart API.
 *
 * @enum {string}
 * @property {string} STORE_SALE - Endpoint for store sales, constructed using the base API URL and the store path.
 */
enum MartEndpoint {
    STORE_SALE = `/api/${ApiUrl.STORE}`,
}

/**
 * An array of endpoint paths used for background synchronization requests.
 *
 * @constant {string[]} ENDPOINT_PATHS - Contains the endpoint paths that are
 * utilized for store sale operations.
 */
const ENDPOINT_PATHS = [MartEndpoint.STORE_SALE]

/**
 * Handles background sync requests by intercepting fetch events.
 *
 * @param event - The fetch event to handle.
 *
 * This function checks if the fetch event matches a specific endpoint.
 * If it matches the `MartEndpoint.STORE_SALE`, it queues the request for background sync
 * and constructs a JSON response indicating that the request has been queued.
 *
 * If the request does not match any known endpoint, an error is thrown.
 *
 * @throws {Error} If the request does not match any known endpoint.
 */
export function handleBgSyncRequest(event: FetchEvent) {
    let response: Response | null = null

    if (isEndpointMatch(event, MartEndpoint.STORE_SALE)) {
        martSales.pushRequest({
            metadata: {
                lastAttemptAt: null,
                status: 'baru diantrekan',
            },
            request: event.request,
        })

        response = constructJsonResponse({
            message: 'Request queued for background sync',
        })
    }

    if (!response) {
        throw new Error('unhandled bg sync request')
    }

    event.respondWith(response)
}

/**
 * Determines if a fetch event is eligible for background synchronization.
 *
 * This function checks if the request method is 'POST' and if the request URL's
 * pathname is included in the predefined list of endpoint paths.
 *
 * @param event - The fetch event to evaluate.
 * @returns `true` if the fetch event is syncable in the background, otherwise `false`.
 */
export function isBgSyncRequest(event: FetchEvent): boolean {
    return (
        event.request.method === 'POST' &&
        ENDPOINT_PATHS.some(endpoint => isEndpointMatch(event, endpoint))
    )
}

/**
 * Checks if the request URL of a FetchEvent matches a specified endpoint.
 *
 * @param event - The FetchEvent containing the request to be checked.
 * @param endpoint - The endpoint to match against the request URL's pathname.
 * @returns A boolean indicating whether the request URL's pathname ends with the specified endpoint.
 */
function isEndpointMatch(event: FetchEvent, endpoint: MartEndpoint) {
    const requestUrl = new URL(event.request.url)
    return requestUrl.pathname.endsWith(endpoint)
}

/**
 * Constructs a JSON response with the provided data.
 *
 * @param data - The data to be included in the JSON response.
 * @returns A Response object with the JSON stringified data and appropriate headers.
 */
function constructJsonResponse(data: object) {
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
