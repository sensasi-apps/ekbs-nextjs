// vendors
import { enqueueSnackbar } from 'notistack'
import axios, { AxiosError } from 'axios'
// utils
import { handleServerError } from './axios/functions/handle-server-error'
import { getCurrentAuthToken } from './axios/getCurrentAuthToken'

/**
 * @todo REDUCE `csrf-cookie` REQUEST IF POSSIBLE.
 */
const myAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withXSRFToken: true,
    withCredentials: true,
})

myAxios.get('/sanctum/csrf-cookie').catch((error: AxiosError) => {
    const { response, code, message } = error

    if (response) {
        handleServerError(response)
    } else if (code !== AxiosError.ERR_NETWORK) {
        enqueueSnackbar(message ?? 'Terjadi kesalahan.', {
            variant: 'error',
            persist: true,
        })
    }

    if (response || code !== AxiosError.ERR_NETWORK) {
        throw error
    }
})

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
                variant: 'error',

                persist: true,
            },
        )
    }

    throw error
})

export default myAxios
