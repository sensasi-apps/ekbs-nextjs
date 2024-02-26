let timerId: NodeJS.Timeout

/**
 *
 * @param fn
 * @param delay - default 250
 * @returns NodeJS.Timeout
 */
export default function debounce(fn: () => unknown, delay: number = 250) {
    clearTimeout(timerId)
    timerId = setTimeout(fn, delay)

    return timerId
}
