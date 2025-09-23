import { useIdle } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'

let lastResponseAt: number = 0

/**
 * @param interval in seconds
 */
export function useIsCanReachItself(interval: number): boolean {
    const intervalInMs = interval * 1000
    const isIdle = useIdle(intervalInMs)

    const [isCanReactItself, setIsCanReachItself] = useState<boolean>(true)

    useEffect(() => {
        if (isIdle) {
            // biome-ignore lint/suspicious/noConsole: Needed
            console.info('🕛 YOUR ARE IDLE')
        } else {
            function handleFetch() {
                const diff = Date.now() - lastResponseAt

                if (diff > intervalInMs) {
                    /**
                     * Set lastResponseAt immediately to prevent isCanFetchItself to be called again before promise resolve
                     */
                    lastResponseAt = Date.now()

                    isCanFetchItself().then(isSuccess => {
                        setIsCanReachItself(isSuccess)
                        lastResponseAt = Date.now()
                    })
                }
            }

            /**
             * set timeout to prevent throttle recalls
             */
            const timeout = setTimeout(handleFetch, 2000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [isIdle, intervalInMs])

    return isCanReactItself
}

async function isCanFetchItself(): Promise<boolean> {
    if (!window.navigator.onLine) return false

    const url = new URL(window.location.origin)
    url.searchParams.set('q', Date.now().toString())

    try {
        const response = await fetch(url.toString(), { method: 'HEAD' })

        return response.ok
    } catch {
        return false
    }
}
