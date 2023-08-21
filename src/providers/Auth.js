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

    const { data: user } = swr

    swr.userHasPermission = permissionName => {
        if (typeof permissionName === 'string') {
            return (
                user?.role_names?.includes('superman') ||
                user?.permission_names.includes(permissionName)
            )
        }

        if (permissionName instanceof Array) {
            return (
                user?.role_names?.includes('superman') ||
                permissionName.every(p => user?.permission_names.includes(p))
            )
        }
    }

    swr.userHasRole = roleName =>
        user?.role_names?.includes('superman') ||
        user?.role_names.includes(roleName)

    swr.userHasRoleId = roleNameId =>
        user?.role_names?.includes('superman') ||
        user?.role_names_id.includes(roleNameId)

    return <AuthContext.Provider value={swr}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider }
export default useAuth
