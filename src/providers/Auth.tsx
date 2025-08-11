'use client'

// types
import type AuthInfo from '@/features/user--auth/types/auth-info'
import type Role from '@/enums/Role'
// vendors
import {
    createContext,
    useContext,
    type ReactNode,
    useState,
    useEffect,
} from 'react'
// functions
import userHasRole from './Auth/userHasRole'
import userHasPermission from './Auth/userHasPermission'
import { login } from './Auth/login'
import { getCurrentAuthInfo } from './Auth/functions/getCurrentAuthInfo'

interface AuthContextType {
    /**
     * `undefined` mean user data is not retrieved yet
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
}

const DEFAULT_CONTEXT_VALUE: AuthContextType = {
    user: null,
    onAgreeTncp: () => {},
    userHasPermission: () => false,
    userHasRole: () => false,
    login: async () => {},
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
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth(): AuthContextType {
    return useContext(AuthContext)
}
