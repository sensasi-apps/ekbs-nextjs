// vendors
import { enqueueSnackbar } from 'notistack'
import Axios, { AxiosError } from 'axios'
// utils
import handleServerError from './axios/handleServerError'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withXSRFToken: true,
    withCredentials: true,
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
