import {
    handleBgSyncRequest,
    isBgSyncRequest,
} from './functions/handle-bg-sync-request'

/**
 * Handles fetch events by checking if they are background sync requests.
 * If the event is a background sync request, it delegates the handling to `handleBgSyncRequest`.
 *
 * @param event - The fetch event to handle.
 */
export function handleFetch(event: FetchEvent) {
    if (!isBgSyncRequest(event)) {
        return
    }

    handleBgSyncRequest(event)
}
