// types
import { AxiosError } from 'axios'
import type { AuthInfo } from '@/dataTypes/User'
// vendors
import { createContext, useContext, ReactNode } from 'react'
import { sha3_256 } from 'js-sha3'
import useSWR from 'swr'
// enums
import Role from '@/enums/Role'
import axios from '@/lib/axios'

type AuthContextType = {
    user: AuthInfo | null | undefined
    onAgreeTncp: () => void
    userHasPermission: (
        permissionName: string | string[],
        userParam?: AuthInfo,
    ) => boolean | undefined
    userHasRole: (
        roleName: string | string[],
        userParam?: AuthInfo,
    ) => boolean | undefined
    onLogoutSuccess: () => void
    login: (email: string, password: string) => Promise<void>
}

const DEFAULT_CONTEXT_VALUE: AuthContextType = {
    user: null,
    onAgreeTncp: () => {},
    userHasPermission: () => false,
    userHasRole: () => false,
    onLogoutSuccess: () => {},
    login: async () => {},
}

const AuthContext = createContext<AuthContextType>(DEFAULT_CONTEXT_VALUE)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: user, mutate } = useSWR(
        '/api/user',
        () =>
            axios
                .get<AuthInfo | null>('/api/user')
                .then(res => res.data)
                .catch((error: AxiosError) => {
                    if (error.response?.status === 401) {
                        return null
                    }

                    // TODO: throw or return reject?
                    throw error
                }),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    )

    return (
        <AuthContext.Provider
            value={{
                user,
                onAgreeTncp: () => {
                    if (user) {
                        mutate({ ...user, is_agreed_tncp: true })
                    }
                },
                onLogoutSuccess: async () => {
                    mutate(null)
                },
                userHasPermission: (
                    permissionName: string | string[],
                    userParam: AuthInfo = user as AuthInfo,
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
                },
                userHasRole: (
                    roleName: string | string[],
                    userParam: AuthInfo = user as AuthInfo,
                ) => {
                    if (!userParam) return

                    if (userParam.role_names?.includes(Role.SUPERMAN)) {
                        return true
                    }

                    if (roleName instanceof Array) {
                        return Boolean(
                            roleName.findIndex(r =>
                                userParam.role_names?.includes(r),
                            ) !== -1 ||
                                roleName.findIndex(r =>
                                    userParam.role_names_id?.includes(r),
                                ) !== -1,
                        )
                    }

                    return Boolean(
                        userParam.role_names?.includes(roleName) ||
                            userParam.role_names_id?.includes(roleName),
                    )
                },
                login: async (email: string, password: string) => {
                    const hash = sha3_256(email.split('@')[0] + password)

                    return axios
                        .post<undefined>('/login', { email, password })
                        .then(() => {
                            mutate().then(authInfo => {
                                localStorage.setItem(
                                    hash,
                                    JSON.stringify(authInfo),
                                )
                            })
                        })
                        .catch((error: AxiosError) => {
                            const localData = localStorage.getItem(hash)

                            if (
                                error.code === AxiosError.ERR_NETWORK &&
                                localData
                            ) {
                                const authInfo = JSON.parse(
                                    localData,
                                ) as AuthInfo

                                mutate(authInfo).catch(() => authInfo)

                                return
                            }

                            return Promise.reject(error)
                        })
                },
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth(): AuthContextType {
    return useContext(AuthContext)
}
