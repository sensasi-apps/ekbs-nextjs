import type { SubmittedData } from '@/components/pages/marts/products/sales/formik-wrapper/@types/submitted-data'
import type { FormattedEntry, MessageType } from '@/sw/functions/handle-message'

/**
 * Sends a message to the active Service Worker and returns a promise that resolves with the response.
 *
 * @template T - The type of the action being sent to the Service Worker.
 * @param {T} action - The action to be sent to the Service Worker.
 * @returns {Promise<ReturnType<T>>} A promise that resolves with the response from the Service Worker.
 * @throws Will throw an error if the Service Worker is not active.
 */
export function postToSw<T extends MessageType['action']>(
    action: T,
): Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
        if (!navigator.serviceWorker.controller) {
            reject('Service Worker belum aktif!')

            return
        }

        const messageChannel = new MessageChannel()

        messageChannel.port1.onmessage = event => {
            resolve(event.data)
        }

        navigator.serviceWorker.controller.postMessage(
            {
                action,
            },
            [messageChannel.port2],
        )
    })
}

type ReturnType<T extends MessageType['action']> = T extends 'FORCE_SYNC'
    ? string
    : T extends 'GET_SALES'
      ? FormattedEntry<SubmittedData>[]
      : never
