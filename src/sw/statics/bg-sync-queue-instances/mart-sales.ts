import { BackgroundSyncQueue } from 'serwist'
import { handleOnSync } from '@/sw/functions/handle-on-sync'

/**
 * A BackgroundSyncQueue instance for handling mart sales synchronization.
 *
 * The queue will automatically handle synchronization
 */
const martSales = new BackgroundSyncQueue('martSales', {
    maxRetentionTime: 60 * 24 * 60, // 2 months
    onSync: async ({ queue }) => await handleOnSync(queue),
})

export default martSales
