import { AuthInfo } from '@/dataTypes/User'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import { sha3_256 } from 'js-sha3'
import { KeyedMutator } from 'swr'

export default async function login(
    email: string,
    password: string,
    mutate: KeyedMutator<AuthInfo | null>,
) {
    const hash = sha3_256(email.split('@')[0] + password)

    return axios
        .post<undefined>('/login', { email, password })
        .then(() =>
            mutate().then(authInfo => {
                localStorage.setItem(hash, JSON.stringify(authInfo))
            }),
        )
        .catch((error: AxiosError) => {
            const localData = localStorage.getItem(hash)

            if (error.code === AxiosError.ERR_NETWORK && localData) {
                const authInfo = JSON.parse(localData) as AuthInfo

                mutate(authInfo).catch(() => authInfo)

                return
            }

            return Promise.reject(error)
        })
}
