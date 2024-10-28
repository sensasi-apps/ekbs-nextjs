export interface BgSyncQueue<T = unknown> {
    timestamp: number | undefined
    body: T
}
