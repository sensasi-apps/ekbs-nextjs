import { createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const router = useRouter()

    const swr = useSWR('/api/user', url =>
        axios
            .get(url)
            .then(res => {
                if (!res.data?.is_active) router.push('logout')

                return res.data
            })
            .catch(error => {
                if (error.response.status === 409)
                    router.replace('/verify-email')

                throw error
            }),
    )

    const { data } = swr

    swr.userHasPermission = (permissionName, user = data) => {
        if (user?.role_names?.includes('superman')) {
            return true
        }

        if (typeof permissionName === 'string') {
            return user?.permission_names?.includes(permissionName)
        }

        if (permissionName instanceof Array) {
            return (
                permissionName.findIndex(p =>
                    user?.permission_names?.includes(p),
                ) !== -1
            )
        }
    }

    swr.userHasRole = (roleName, user = data) => {
        if (user?.role_names?.includes('superman')) {
            return true
        }

        if (typeof roleName === 'string') {
            return (
                user?.role_names?.includes(roleName) ||
                user?.role_names_id?.includes(roleName)
            )
        }

        if (roleName instanceof Array) {
            return (
                roleName.findIndex(r => user?.role_names?.includes(r)) !== -1 ||
                roleName.findIndex(r => user?.role_names_id?.includes(r)) !== -1
            )
        }
    }

    return <AuthContext.Provider value={swr}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider }
export default useAuth
