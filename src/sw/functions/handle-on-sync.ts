import type { BackgroundSyncQueue } from 'serwist'

/**
 * Handles the synchronization of a background sync queue.
 *
 * This function processes each request in the provided `BackgroundSyncQueue`.
 * It attempts to send each request using the Fetch API. If a request fails
 * (either due to a client-side error or a server-side error with a status code
 * of 400 or higher), the request is re-added to the queue with updated metadata
 * indicating the failure status and the time of the last attempt.
 *
 * @param queue - The background sync queue to process.
 * @throws Will throw an error if a request fails to be sent.
 */
export async function handleOnSync(queue: BackgroundSyncQueue) {
    const nQueue = await queue.size()

    for (let i = 0; i < nQueue; i++) {
        const entry = await queue.shiftRequest()

        if (entry) {
            let errorMsg: null | string = null
            let response: null | Response = null

            try {
                response = await fetch(entry.request.clone())
            } catch (error: unknown) {
                // Client-side error
                const typedError = error as Error
                errorMsg = typedError.message
            }

            if ((response && response.status >= 400) || errorMsg) {
                const responseBody = await response?.json()
                const status =
                    responseBody?.message ?? response?.statusText ?? errorMsg

                queue.unshiftRequest({
                    ...entry,
                    metadata: {
                        ...entry.metadata,
                        lastAttemptAt: Date.now(),
                        status: status,
                    },
                })

                throw new Error(status)
            }
        }
    }
}
