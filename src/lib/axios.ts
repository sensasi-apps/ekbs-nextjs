import Axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

// axios.interceptors.request.use(config => {
// TODO: implement pendings when offline
// if (!navigator.onLine && config.method === 'post') {
// enqueueSnackbar(
//     'Anda sedang offline, mohon periksa koneksi internet anda',
//     {
//         variant: 'error',
//     },
// )
// return Promise.reject('offline')
// }

// return config
// })

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
