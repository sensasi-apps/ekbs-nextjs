let timerId: NodeJS.Timeout

export default function debounce(fn: () => unknown, delay: number = 250) {
    clearTimeout(timerId)
    timerId = setTimeout(fn, delay)

    return timerId
}
