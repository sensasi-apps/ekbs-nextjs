import { martSales } from '../statics/bg-sync-queue-instances/mart-sales'
import { handleOnSync } from './handle-on-sync'

export async function handleMessage(event: ExtendableMessageEvent) {
    const { action } = event.data as MessageType

    if (action === 'FORCE_SYNC') {
        try {
            await handleOnSync(martSales)
            return event.ports[0]?.postMessage('Finished syncing')
        } catch (error: unknown) {
            return event.ports[0]?.postMessage((error as Error).message)
        }
    }

    if (action === 'GET_SALES') {
        const entries = await martSales.getAll()

        const formattedEntries = await Promise.all<FormattedEntry>(
            entries.map(async entry => ({
                body: await entry.request.json(),
                timestamp: entry.timestamp,
                status: entry.metadata?.status as string,
                lastAttemptAt: (entry.metadata?.lastAttemptAt ?? null) as
                    | string
                    | null,
            })),
        )

        return event.ports[0]?.postMessage(formattedEntries)
    }
}

export interface FormattedEntry<T = unknown> {
    body: T
    status: string
    timestamp?: number
    lastAttemptAt: string | null
}

export interface MessageType {
    action: 'FORCE_SYNC' | 'GET_SALES'
}
