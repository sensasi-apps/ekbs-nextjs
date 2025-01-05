import { useIdle } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'

let isStillFetching = false
let lastResponseAt: number = 0

/**
 * @param interval in seconds (default: 60 secs)
 */
export function useIsCanReachItself(interval: number): boolean {
    const intervalInMs = interval * 1000
    const isIdle = useIdle(intervalInMs)

    const [isCanReactItself, setIsCanReachItself] = useState<boolean>(false)

    useEffect(() => {
        if (isIdle) {
            // eslint-disable-next-line
            console.info('🕛 YOUR ARE IDLE')
        } else {
            function handleFetch() {
                const diff = Date.now() - lastResponseAt

                if (!isStillFetching && diff > intervalInMs) {
                    /**
                     * Set lastResponseAt immediately to prevent isCanFetchItself to be called again before promise resolve
                     */
                    lastResponseAt = Date.now()

                    isStillFetching = true

                    isCanFetchItself().then(isSuccess => {
                        setIsCanReachItself(isSuccess)
                        isStillFetching = false
                        lastResponseAt = Date.now()
                    })
                }
            }

            handleFetch()

            const intervalId = setInterval(handleFetch, intervalInMs)

            return () => clearInterval(intervalId)
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
