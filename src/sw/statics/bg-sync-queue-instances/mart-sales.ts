import { BackgroundSyncQueue } from 'serwist'
import { handleOnSync } from '@/sw/functions/handle-on-sync'

/**
 * A BackgroundSyncQueue instance for handling mart sales synchronization.
 *
 * @example
 * // Usage example
 * import { martSales } from './path/to/mart-sales';
 *
 * // The queue will automatically handle synchronization
 */
export const martSales = new BackgroundSyncQueue('martSales', {
    maxRetentionTime: 60 * 24 * 60, // 2 months
    onSync: async ({ queue }) => {
        await handleOnSync(queue)
    },
})
