// vendors
import { enqueueSnackbar } from 'notistack'
import Axios, { AxiosError } from 'axios'
// utils
import getCookie from '@/utils/getCookie'
import handleServerError from './axios/handleServerError'

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
    const { response, code } = error

    if (response) {
        handleServerError(response)
    } else if (code === AxiosError.ERR_NETWORK) {
        enqueueSnackbar(
            'Permintaan gagal dikirimkan, mohon periksa kembali koneksi internet anda',
            {
                variant: 'error',
                persist: true,
            },
        )
    }

    return Promise.reject(error)
})

export default axios
