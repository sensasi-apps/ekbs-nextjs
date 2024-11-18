/**
 * Provides a cache mechanism using the browser's localStorage.
 *
 * This function initializes a Map object with data from localStorage (if available)
 * and sets up an event listener to save the cache back to localStorage before the window unloads.
 */
export function cacheProvider() {
    const map = new Map<string, object>(
        JSON.parse(localStorage.getItem('app-cache') ?? '[]'),
    )

    window.addEventListener('beforeunload', () => {
        let isSuccessful = false

        while (!isSuccessful) {
            const appCache = JSON.stringify(Array.from(map.entries()))

            try {
                localStorage.setItem('app-cache', appCache)
                isSuccessful = true
            } catch {
                const firstKey = map.keys().next().value

                if (firstKey) {
                    map.delete(firstKey)
                }
            }
        }
    })

    return map
}
