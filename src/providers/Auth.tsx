// types
import type { AuthInfo } from '@/@types/Data/auth-info'
import type Role from '@/enums/Role'
// vendors
import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from 'react'
// functions
import userHasRole from './Auth/userHasRole'
import userHasPermission from './Auth/userHasPermission'
import { login } from './Auth/login'
import { logout } from './Auth/logout'
import { getCurrentAuthInfo } from './Auth/functions/getCurrentAuthInfo'

interface AuthContextType {
    /**
     * `undefined` mean user data is not retrived yet
     *
     * @default undefined
     */
    user: AuthInfo | null | undefined
    onAgreeTncp: () => void
    userHasPermission: (
        permissionName: string | string[],
        userParam?: AuthInfo,
    ) => boolean
    userHasRole: (roleName: Role | Role[], userParam?: AuthInfo) => boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const DEFAULT_CONTEXT_VALUE: AuthContextType = {
    user: null,
    onAgreeTncp: () => {},
    userHasPermission: () => false,
    userHasRole: () => false,
    login: async () => {},
    logout: () => {},
}

const AuthContext = createContext<AuthContextType>(DEFAULT_CONTEXT_VALUE)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthInfo | null | undefined>(undefined)

    useEffect(() => {
        setUser(getCurrentAuthInfo())
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,

                onAgreeTncp: () => {
                    if (user) {
                        setUser({
                            ...user,
                            is_agreed_tncp: true,
                        })
                    }
                },

                userHasPermission: (permissionName, userParam) =>
                    userHasPermission(
                        permissionName,
                        userParam ?? user ?? undefined,
                    ),

                userHasRole: (roleName, userParam) =>
                    userHasRole(roleName, userParam ?? user ?? undefined),

                login: (email, password) => login(email, password, setUser),

                logout: () => logout(setUser),
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth(): AuthContextType {
    return useContext(AuthContext)
}
