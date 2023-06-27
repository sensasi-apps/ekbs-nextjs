import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import axios from '@/lib/axios'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const router = useRouter()
    const [themeColorMode, setThemeColorMode] = useState('dark')

    const {
        data: user,
        // error,
        mutate,
    } = useSWR('/api/user', url =>
        axios
            .get(url)
            .then(res => {
                if (!res.data?.is_active) router.push('logout?error=inactive')
                if (res.data) window.localStorage.setItem('isLoggedIn', true)

                return res.data
            })
            .catch(error => {
                if (error.response.status !== 409) throw error

                return router.replace('/verify-email')
            }),
    )

    useEffect(function () {
        const savedMode = localStorage.getItem('colorMode')

        if (savedMode !== 'light') setThemeColorMode('dark')
    }, [])

    const toggleColorMode = () => {
        setThemeColorMode(prevMode => {
            const newMode = prevMode === 'light' ? 'dark' : 'light'

            localStorage.setItem('colorMode', newMode)

            return newMode
        })
    }

    return (
        <AppContext.Provider
            value={{
                themeColorMode,
                toggleColorMode,
                auth: {
                    user,
                    mutate,
                },
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
