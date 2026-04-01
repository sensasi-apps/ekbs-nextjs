'use client'

import axios, { AxiosError } from 'axios'
// vendors
import { enqueueSnackbar } from 'notistack'
import { LS_KEY } from '@/hooks/use-auth-info'
// utils
import { handleServerError } from './axios/functions/handle-server-error'
import { getCurrentAuthToken } from './axios/getCurrentAuthToken'

const myAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    withXSRFToken: true,
})

if (typeof window !== 'undefined') {
    myAxios
        .get('/sanctum/csrf-cookie')
        .then(() => {
            const token = getCurrentAuthToken()

            if (!token) {
                myAxios.get('/current-auth-info').then(res => {
                    if (res.data) {
                        localStorage.setItem(LS_KEY, JSON.stringify(res.data))
                        window.location.reload()
                    }
                })
            }
        })
        .catch((error: AxiosError) => {
            const { response, code, message } = error

            if (response) {
                handleServerError(response)
            } else if (code !== AxiosError.ERR_NETWORK) {
                enqueueSnackbar(message ?? 'Terjadi kesalahan.', {
                    persist: true,
                    variant: 'error',
                })
            }

            if (response || code !== AxiosError.ERR_NETWORK) {
                throw error
            }
        })
}

myAxios.interceptors.request.use(config => {
    const token = getCurrentAuthToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    config.baseURL += '/api'

    return config
})

myAxios.interceptors.response.use(undefined, (error: AxiosError) => {
    const { response, code } = error

    if (response) {
        handleServerError(response)
    }

    if (code === AxiosError.ERR_NETWORK) {
        enqueueSnackbar(
            'Permintaan gagal dikirimkan, mohon periksa kembali koneksi internet anda.',
            {
                persist: true,
                variant: 'error',
            },
        )
    }

    throw error
})

export default myAxios
