import { createContext } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import axios from '@/lib/axios'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const router = useRouter()

    const {
        data: user,
        error,
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
                if (error.response.status === 409)
                    return router.replace('/verify-email')

                if (
                    window.localStorage.getItem('isLoggedIn') === 'true' &&
                    error.response.status === 401
                )
                    router.push('/logout')

                throw error
            }),
    )

    function userHasPermission(permission) {
        return (
            user?.role_names?.includes('superman') ||
            user?.permission_names?.includes(permission)
        )
    }

    return (
        <AppContext.Provider
            value={{
                auth: {
                    user,
                    error,
                    mutate,
                    userHasPermission,
                },
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
