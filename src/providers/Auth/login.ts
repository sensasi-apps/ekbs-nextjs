// types
import type AuthInfo from '@/features/user--auth/types/auth-info'
// vendors
import { AxiosError } from 'axios'
import axios from '@/lib/axios'
// functions
import { getUserHashKey } from './functions/getUserHashKey'

export async function login(
    email: string,
    password: string,
    setUser: (user: AuthInfo | undefined) => void,
) {
    const hashKey = getUserHashKey(email, password)

    const storedAuthInfoJson = localStorage.getItem(hashKey)
    const storedAuthInfo = storedAuthInfoJson
        ? (JSON.parse(storedAuthInfoJson) as AuthInfo)
        : undefined

    setUser(storedAuthInfo)

    return axios
        .post<AuthInfo>('/login', {
            email,
            password,
        })
        .then(({ data: authInfo }) => {
            const authInfoJson = JSON.stringify(authInfo)

            if (storedAuthInfoJson !== authInfoJson) {
                setUser(authInfo)
                localStorage.setItem(hashKey, authInfoJson)
            }
        })
        .catch(
            (
                err: AxiosError<{
                    message?: string
                }>,
            ) => {
                if (err.code === AxiosError.ERR_NETWORK && storedAuthInfo) {
                    return
                }

                setUser(undefined)
                return Promise.reject(err)
            },
        )
}
