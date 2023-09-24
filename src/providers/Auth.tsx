import {
    FC,
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'

import axios from '@/lib/axios'

import type UserDataType from '@/dataTypes/User'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: FC<{
    children?: ReactNode
}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<UserDataType | null | undefined>(undefined)

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
        userParam: UserDataType = user as UserDataType,
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
        userParam: UserDataType = user as UserDataType,
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
        onLoginSuccess: (userParam: UserDataType) => {
            setIsAuthenticated(true)
            setUser(userParam)
        },
        onLogoutSuccess: () => {
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
    user: UserDataType | null | undefined
    userHasPermission: (
        permissionName: string | string[],
        userParam?: UserDataType,
    ) => boolean
    userHasRole: (
        roleName: string | string[],
        userParam?: UserDataType,
    ) => boolean

    onLogoutSuccess: () => void
    onLoginSuccess: (user: UserDataType) => void
    onError401: () => void
}

const useAuth = () => useContext(AuthContext) as AuthContextType

export { AuthProvider }
export default useAuth
