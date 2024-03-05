import { useEffect, useState } from 'react'

export const useOnlineStatus = () => {
    const [online, setOnline] = useState(
        typeof window !== 'undefined' ? window.navigator.onLine : true,
    )

    const [errNetwork, setErrNetwork] = useState(false)

    useEffect(() => {
        // create event handler
        const handleStatusChange = () => {
            setOnline(navigator.onLine)
        }

        const handleAxiosRequestFulfilled = () => {
            if (errNetwork) {
                setErrNetwork(false)
            }
        }
        const handleErrNetwork = () => setErrNetwork(true)

        // listen for online and ofline event
        window.addEventListener('online', handleStatusChange)
        window.addEventListener('offline', handleStatusChange)
        window.addEventListener('errNetwork', handleErrNetwork)
        window.addEventListener(
            'axiosRequestFulfilled',
            handleAxiosRequestFulfilled,
        )

        // clean up to avoid memory-leak
        return () => {
            window.removeEventListener('online', handleStatusChange)
            window.removeEventListener('offline', handleStatusChange)
            window.removeEventListener('errNetwork', handleErrNetwork)
            window.removeEventListener(
                'axiosRequestFulfilled',
                handleAxiosRequestFulfilled,
            )
        }
    }, [])

    return online || errNetwork
}
