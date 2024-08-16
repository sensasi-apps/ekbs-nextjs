// types
import type { AxiosError } from 'axios'
import type UserType from '@/dataTypes/User'
// vendors
import { createContext, useContext, useState, ReactNode } from 'react'
import useSWR from 'swr'
// enums
import Role from '@/enums/Role'
import axios from '@/lib/axios'

type AuthContextType = {
    isAuthenticated: boolean
    user: UserType | null | undefined
    onAgreeTncp: () => void
    userHasPermission: (
        permissionName: string | string[],
        userParam?: UserType,
    ) => boolean | undefined
    userHasRole: (
        roleName: string | string[],
        userParam?: UserType,
    ) => boolean | undefined
    onLogoutSuccess: () => void
    onLoginSuccess: (user: UserType) => void
    onError401: () => void
}

const DEFAULT_CONTEXT_VALUE: AuthContextType = {
    isAuthenticated: false,
    user: null,
    onAgreeTncp: () => {},
    userHasPermission: () => false,
    userHasRole: () => false,
    onLogoutSuccess: () => {},
    onLoginSuccess: () => {},
    onError401: () => {},
}

const AuthContext = createContext<AuthContextType>(DEFAULT_CONTEXT_VALUE)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const { data: user, mutate } = useSWR(
        '/api/user',
        () =>
            axios
                .get<UserType | null>('/api/user')
                .then(res => res.data)
                .catch((error: AxiosError) => {
                    if (error.response?.status === 401) {
                        setIsAuthenticated(false)
                    }

                    throw error
                }),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    )

    const userHasPermission = (
        permissionName: string | string[],
        userParam: UserType = user as UserType,
    ) => {
        if (!userParam) return

        if (userParam.role_names?.includes(Role.SUPERMAN)) {
            return true
        }

        if (permissionName instanceof Array) {
            return (
                permissionName.findIndex(p =>
                    userParam.permission_names?.includes(p),
                ) !== -1
            )
        }

        return userParam.permission_names?.includes(permissionName)
    }

    const userHasRole = (
        roleName: string | string[],
        userParam: UserType = user as UserType,
    ) => {
        if (!userParam) return

        if (userParam.role_names?.includes(Role.SUPERMAN)) {
            return true
        }

        if (roleName instanceof Array) {
            return Boolean(
                roleName.findIndex(r => userParam.role_names?.includes(r)) !==
                    -1 ||
                    roleName.findIndex(r =>
                        userParam.role_names_id?.includes(r),
                    ) !== -1,
            )
        }

        return Boolean(
            userParam.role_names?.includes(roleName) ||
                userParam.role_names_id?.includes(roleName),
        )
    }

    const ContextValue: AuthContextType = {
        isAuthenticated,
        user,
        onAgreeTncp: () => {
            if (user) {
                mutate({ ...user, is_agreed_tncp: true })
            }
        },
        onLoginSuccess: (userParam: UserType) => {
            setIsAuthenticated(true)
            mutate(userParam)
        },
        onLogoutSuccess: async () => {
            const cache = await caches.open('auth-user-cache')
            const keys = await cache.keys()
            keys.forEach(async req => await cache.delete(req))

            mutate(null)
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

export default function useAuth(): AuthContextType {
    return useContext(AuthContext)
}
