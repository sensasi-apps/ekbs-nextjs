import type { SwMessage } from '@/@types/sw-message'

export function postMessageToSW<T = void>(message: SwMessage): Promise<T> {
    return new Promise((resolve, reject) => {
        if (!navigator.serviceWorker.controller) {
            reject('Service Worker belum aktif!')

            return
        }

        const messageChannel = new MessageChannel()

        messageChannel.port1.onmessage = event => {
            resolve(event.data)
        }

        navigator.serviceWorker.controller.postMessage(message, [
            messageChannel.port2,
        ])
    })
}
