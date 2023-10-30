import Axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import getCookie from '@/utils/getCookie'

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

let timoutId: NodeJS.Timeout | undefined

axios.interceptors.response.use(undefined, error => {
    if (error.response) {
        const { status } = error.response

        if (status === 401) {
            dispatchEvent(new CustomEvent('401Error'))
        }

        if (status === 403) {
            enqueueSnackbar('Anda tidak memiliki akses untuk halaman ini', {
                variant: 'error',
                autoHideDuration: 10000,
            })
        }

        if (status === 500) {
            enqueueSnackbar('Server eror, permintaan tidak dapat diproses', {
                variant: 'error',
                autoHideDuration: 10000,
            })
        }
    } else if (error.request) {
        if (error.code === 'ERR_NETWORK' && !timoutId) {
            if (!navigator.onLine) {
                const type =
                    error.config.method === 'get' ? 'mengambil' : 'mengirim'

                enqueueSnackbar(
                    `Tidak dapat ${type} data karena Anda sedang offline`,
                    {
                        variant: 'error',
                        autoHideDuration: 10000,
                    },
                )
            } else {
                enqueueSnackbar(
                    'Server EKBS tidak dapat dijangkau saat ini, mohon coba lagi nanti.',
                    {
                        variant: 'error',
                        autoHideDuration: 10000,
                    },
                )
            }

            timoutId = setTimeout(() => {
                clearTimeout(timoutId)
                timoutId = undefined
            }, 1000)
        }
    }

    return Promise.reject(error)
})

export default axios
