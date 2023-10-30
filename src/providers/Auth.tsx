import {
    FC,
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'

import axios from '@/lib/axios'

import type UserType from '@/dataTypes/User'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: FC<{
    children?: ReactNode
}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<UserType | null | undefined>()

    useEffect(() => {
        axios
            .get('/api/user')
            .then(res => res.data)
            .then(user => {
                setUser(user)
                setIsAuthenticated(true)
            })
            .catch(() => setUser(null))
    }, [])

    const userHasPermission = (
        permissionName: string | string[],
        userParam: UserType = user as UserType,
    ) => {
        if (userParam?.role_names?.includes('superman')) {
            return true
        }

        if (permissionName instanceof Array) {
            return (
                permissionName.findIndex(
                    p => userParam?.permission_names?.includes(p),
                ) !== -1
            )
        }

        return userParam?.permission_names?.includes(permissionName)
    }

    const userHasRole = (
        roleName: string | string[],
        userParam: UserType = user as UserType,
    ) => {
        if (userParam?.role_names?.includes('superman')) {
            return true
        }

        if (roleName instanceof Array) {
            return Boolean(
                roleName.findIndex(r => userParam?.role_names?.includes(r)) !==
                    -1 ||
                    roleName.findIndex(
                        r => userParam?.role_names_id?.includes(r),
                    ) !== -1,
            )
        }

        return Boolean(
            userParam?.role_names?.includes(roleName) ||
                userParam?.role_names_id?.includes(roleName),
        )
    }

    const ContextValue: AuthContextType = {
        isAuthenticated,
        user,
        onAgreeTncp: () => {
            if (user) {
                setUser({ ...user, is_agreed_tncp: true })
            }
        },
        onLoginSuccess: (userParam: UserType) => {
            setIsAuthenticated(true)
            setUser(userParam)
        },
        onLogoutSuccess: async () => {
            const cache = await caches.open('auth-user-cache')
            await cache.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
            )

            setUser(null)
            setIsAuthenticated(false)
        },
        userHasPermission,
        userHasRole,
        onError401: () => setIsAuthenticated(false),
    }

    return (
        <AuthContext.Provider value={ContextValue}>
            {children}
        </AuthContext.Provider>
    )
}

type AuthContextType = {
    isAuthenticated: boolean
    user: UserType | null | undefined
    onAgreeTncp: () => void
    userHasPermission: (
        permissionName: string | string[],
        userParam?: UserType,
    ) => boolean
    userHasRole: (roleName: string | string[], userParam?: UserType) => boolean

    onLogoutSuccess: () => void
    onLoginSuccess: (user: UserType) => void
    onError401: () => void
}

const useAuth = () => useContext(AuthContext) as AuthContextType

export { AuthProvider }
export default useAuth
