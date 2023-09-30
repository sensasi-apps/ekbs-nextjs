import Axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

let timoutId: NodeJS.Timeout | undefined

axios.interceptors.request.use(config => {
    if (!navigator.onLine) {
        if (!timoutId) {
            const type = config.method === 'get' ? 'mengambil' : 'mengirim'

            enqueueSnackbar(
                `Tidak dapat ${type} data karena Anda sedang offline`,
                {
                    variant: 'error',
                },
            )

            timoutId = setTimeout(() => {
                clearTimeout(timoutId)
                timoutId = undefined
            }, 1000)
        }

        return Promise.reject('offline')
    }

    return config
})

axios.interceptors.response.use(undefined, error => {
    if (error.response) {
        const { status } = error.response

        if (status === 401) {
            dispatchEvent(new CustomEvent('401Error'))
        }

        if (status === 403) {
            enqueueSnackbar('Anda tidak memiliki akses untuk halaman ini', {
                variant: 'error',
            })
        }

        // if (status === 409) {
        // return router.replace('/verify-email')
        // }

        if (status === 500) {
            enqueueSnackbar('Server eror, permintaan tidak dapat diproses', {
                variant: 'error',
            })
        }
    } else if (error.request) {
        if (error.request.status === 0) {
            enqueueSnackbar(
                'Server EKBS tidak dapat dijangkau saat ini, mohon coba lagi nanti.',
                {
                    variant: 'error',
                },
            )
        }
    }

    return Promise.reject(error)
})

export default axios
