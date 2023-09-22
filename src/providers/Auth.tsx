import {
    FC,
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { dbPromise } from '@/lib/idb'

import UserDataType from '@/dataTypes/User'

const AuthContext = createContext({})

const AuthProvider: FC<{
    children?: ReactNode
}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<UserDataType | null | undefined>(undefined)

    useEffect(() => {
        dbPromise.then(db => {
            db.get('user', 0).then(user => {
                if (!user) {
                    return setUser(null)
                }

                setUser(user)
                setIsAuthenticated(true)
            })
        })
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
            dbPromise.then(db => db.put('user', userParam, 0))
        },
        onLogoutSuccess: () => {
            setUser(null)
            setIsAuthenticated(false)
            dbPromise.then(db => db.clear('user'))
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
