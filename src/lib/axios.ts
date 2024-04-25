// types
import type { AxiosError } from 'axios'
// vendors
import Axios from 'axios'
// utils
import getCookie from '@/utils/getCookie'
import handleServerError from './axios/handleServerError'
import { enqueueSnackbar } from 'notistack'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

axios.interceptors.request.use(request => {
    if (request.method !== 'get') {
        const csrf = getCookie(request.xsrfCookieName || 'XSRF-TOKEN')

        if (csrf) {
            request.headers[request.xsrfHeaderName || 'X-XSRF-TOKEN'] = csrf
        }
    }

    return request
})

axios.interceptors.response.use(undefined, (error: AxiosError) => {
    const { response, request } = error

    if (response) {
        handleServerError(response)
    } else if (request) {
        const { code } = request

        if (code === 'ERR_NETWORK') {
            enqueueSnackbar(
                'Permintaan gagal dikirimkan, mohon periksa kembali koneksi internet anda',
                {
                    variant: 'error',
                    persist: true,
                },
            )
        }
    }

    return Promise.reject(error)
})

export default axios
