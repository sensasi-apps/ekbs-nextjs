import type { AuthInfo } from '@/dataTypes/User'
import { AxiosError } from 'axios'
import axios from '@/lib/axios'
import { getUserHashKey } from './functions/getUserHashKey'
import { getDeviceId } from '@/functions/getDeviceId'

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

    const headers = storedAuthInfo
        ? { Authorization: `Bearer ${storedAuthInfo.access_token}` }
        : {}

    /**
     * TODO: NOT USING `location` FOR MORE SMOOTH UX
     */
    function unauthRedirectWithResponse(status: number, message: string) {
        setUser(null)

        const base64Response = btoa(
            JSON.stringify({
                status,
                message,
            }),
        )

        location.replace('/login?response=' + base64Response)
    }

    function handleFail(
        err: AxiosError<{
            message?: string
        }>,
    ) {
        if (err.code === AxiosError.ERR_NETWORK && storedAuthInfoJson) {
            localStorage.setItem('currentAuthInfo', storedAuthInfoJson)
        } else {
            unauthRedirectWithResponse(
                err.response?.status ?? err.status ?? 401,
                err.response?.data?.message ?? err.message,
            )
        }
    }

    return axios
        .post<AuthInfo>(
            '/login',
            {
                email,
                password,
                device_id: getDeviceId(),
            },
            { headers },
        )
        .then(res => {
            if (res.data.is_active) {
                setUser(res.data)

                const authInfoJson = JSON.stringify(res.data)
                localStorage.setItem(hashKey, authInfoJson)
                localStorage.setItem('currentAuthInfo', authInfoJson)
            } else {
                unauthRedirectWithResponse(403, 'Akun anda belum aktif')
            }
        })
        .catch(handleFail)
}
