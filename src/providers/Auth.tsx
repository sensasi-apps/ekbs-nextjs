'use client'

// types
import type AuthInfo from '@/features/user--auth/types/auth-info'
import type Role from '@/enums/Role'
// vendors
import { createContext, useContext, type ReactNode } from 'react'
// functions
import userHasRole from './Auth/userHasRole'
import userHasPermission from './Auth/userHasPermission'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'

interface AuthContextType {
    userHasPermission: (
        permissionName: string | string[],
        userParam?: AuthInfo,
    ) => boolean
    userHasRole: (roleName: Role | Role[], userParam?: AuthInfo) => boolean
}

const DEFAULT_CONTEXT_VALUE: AuthContextType = {
    userHasPermission: () => false,
    userHasRole: () => false,
}

const AuthContext = createContext<AuthContextType>(DEFAULT_CONTEXT_VALUE)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user] = useAuthInfoState()

    return (
        <AuthContext.Provider
            value={{
                userHasPermission: (permissionName, userParam) =>
                    userHasPermission(
                        permissionName,
                        userParam ?? user ?? undefined,
                    ),

                userHasRole: (roleName, userParam) =>
                    userHasRole(roleName, userParam ?? user ?? undefined),
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth(): AuthContextType {
    return useContext(AuthContext)
}
