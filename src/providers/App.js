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
                // default from breeze
                //     if (middleware === 'guest' && redirectIfAuthenticated && user)
                //         router.push(redirectIfAuthenticated)
                //     if (
                //         window.location.pathname === '/verify-email' &&
                //         user?.email_verified_at
                //     )
                //         router.push(redirectIfAuthenticated)
                //     // if (middleware === 'auth' && error) logout()

                if (!res.data?.is_active) router.push('logout?error=inactive')
                if (res.data) window.localStorage.setItem('isLoggedIn', true)

                return res.data
            })
            .catch(error => {
                if (error.response.status !== 409) throw error

                return router.replace('/verify-email')
            }),
    )

    return (
        <AppContext.Provider
            value={{
                auth: {
                    user,
                    error,
                    mutate,
                },
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext

// register default from breeze
// const register = async ({ setErrors, ...props }) => {
//     // await csrf()

//     setErrors([])

//     axios
//         .post('/register', props)
//         // .then(() => mutate())
//         .catch(error => {
//             if (error.response.status !== 422) throw error

//             setErrors(error.response.data.errors)
//         })
// }
