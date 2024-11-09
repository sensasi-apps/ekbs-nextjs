import { handleOnSync } from '@/sw/functions/handle-on-sync'
import { BackgroundSyncQueue } from 'serwist'

export const martSales = new BackgroundSyncQueue('martSales', {
    maxRetentionTime: 60 * 24 * 60, // 2 months
    onSync: async ({ queue }) => {
        await handleOnSync(queue)
    },
})
