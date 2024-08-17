// types
import { AxiosError } from 'axios'
import type { AuthInfo } from '@/dataTypes/User'
// vendors
import { createContext, useContext, ReactNode } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'
// functions
import logout from './Auth/logout'
import login from './Auth/login'
import userHasRole from './Auth/userHasRole'
import userHasPermission from './Auth/userHasPermission'

type AuthContextType = {
    user: AuthInfo | null | undefined
    onAgreeTncp: () => void
    userHasPermission: (
        permissionName: string | string[],
        userParam?: AuthInfo,
    ) => boolean
    userHasRole: (roleName: string | string[], userParam?: AuthInfo) => boolean
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
}

const DEFAULT_CONTEXT_VALUE: AuthContextType = {
    user: null,
    onAgreeTncp: () => {},
    userHasPermission: () => false,
    userHasRole: () => false,
    logout: async () => {},
    login: async () => {},
}

const AuthContext = createContext<AuthContextType>(DEFAULT_CONTEXT_VALUE)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: user, mutate } = useSWR('/api/user', fetcher, SWR_CONFIG)

    return (
        <AuthContext.Provider
            value={{
                user,
                onAgreeTncp: () => {
                    if (user) {
                        mutate({ ...user, is_agreed_tncp: true })
                    }
                },
                userHasPermission: (permissionName, userParam) =>
                    userHasPermission(
                        permissionName,
                        userParam ?? user ?? undefined,
                    ),
                userHasRole: (roleName, userParam) =>
                    userHasRole(roleName, userParam ?? user ?? undefined),
                login: (email, password) => login(email, password, mutate),
                logout: () => logout(mutate),
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth(): AuthContextType {
    return useContext(AuthContext)
}

const SWR_CONFIG = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    keepPreviousData: true,
}

async function fetcher(arg: string) {
    return axios
        .get<AuthInfo | null>(arg)
        .then(res => res.data)
        .catch((error: AxiosError) => {
            if (
                error.response?.status === 401 ||
                error.code === AxiosError.ERR_NETWORK
            ) {
                return null
            }

            return Promise.reject(error)
        })
}
