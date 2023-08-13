import { createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'

import User from '@/classes/user'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const router = useRouter()

    const swr = useSWR('/api/user', url =>
        axios
            .get(url)
            .then(res => {
                if (!res.data?.is_active) router.push('logout')

                return new User(res.data)
            })
            .catch(error => {
                if (error.response.status === 409)
                    router.replace('/verify-email')

                throw error
            }),
    )

    return <AuthContext.Provider value={swr}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider }
export default useAuth
