// types
import type AuthInfo from '@/features/user--auth/types/auth-info'
// vendors
import { AxiosError } from 'axios'
import axios from '@/lib/axios'
// functions
import { getUserHashKey } from './functions/getUserHashKey'
import { setCurrentAuthInfo } from './functions/setCurrentAuthInfo'

export async function login(
    email: string,
    password: string,
    setUser: (user: AuthInfo | null) => void,
) {
    const hashKey = getUserHashKey(email, password)

    const storedAuthInfoJson = localStorage.getItem(hashKey)
    const storedAuthInfo = storedAuthInfoJson
        ? (JSON.parse(storedAuthInfoJson) as AuthInfo)
        : null

    setUser(storedAuthInfo)

    if (storedAuthInfo) {
        setCurrentAuthInfo(storedAuthInfo)
    }

    return axios
        .post<AuthInfo>('/login', {
            email,
            password,
        })
        .then(({ data: authInfo }) => {
            const authInfoJson = JSON.stringify(authInfo)

            if (storedAuthInfoJson !== authInfoJson) {
                setUser(authInfo)
                setCurrentAuthInfo(authInfo)
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

                setUser(null)
                localStorage.removeItem('currentAuthInfo')
                return Promise.reject(err)
            },
        )
}
