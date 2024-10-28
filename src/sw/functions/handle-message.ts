import { SwMessage } from '@/@types/sw-message'
import { martSales } from '../statics/bg-sync-queue-instance/mart-sales'
import { BgSyncQueue } from '@/@types/bg-sync-queue'

export async function handleMessage(event: ExtendableMessageEvent) {
    const { action } = event.data as SwMessage

    if (action === 'FORCE_SYNC') {
        return martSales.replayRequests()
    }

    if (action === 'GET_SALES') {
        const entries = await martSales.getAll()

        const formattedEntries = await Promise.all<BgSyncQueue>(
            entries.map(async entry => ({
                timestamp: entry.timestamp,
                body: await entry.request.json(),
            })),
        )

        return event.ports[0]?.postMessage(formattedEntries)
    }
}
