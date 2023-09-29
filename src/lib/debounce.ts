let timerId: NodeJS.Timeout

const debounce = (fn: () => any, delay: number) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
        fn()
    }, delay)
}

export default debounce
