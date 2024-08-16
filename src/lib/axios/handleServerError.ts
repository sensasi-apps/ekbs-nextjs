import type { AxiosResponse } from 'axios'
import { OptionsObject, enqueueSnackbar } from 'notistack'
import SNACKBAR_419_OPTIONS from './SNACKBAR_419_OPTIONS'

const SNACKBAR_OPTIONS: OptionsObject = {
    variant: 'error',
    persist: true,
}

export default function handleServerError({ status, data }: AxiosResponse) {
    if (status === 419 && data.message === 'CSRF token mismatch.') {
        enqueueSnackbar(
            'Halaman ini sudah kadaluarsa, peramban akan disegarkan dalam 10 detik.',
            SNACKBAR_419_OPTIONS,
        )

        setTimeout(() => {
            location.reload()
        }, 10000)

        return
    }

    switch (status) {
        case 401:
            // disabling this case for now 2024-08-16
            // dispatchEvent(new CustomEvent('401Error'))
            break

        case 422:
            // add 422 case to prevent default error message
            // validation error are handled on each form
            break

        case 403:
            enqueueSnackbar(
                'Anda tidak memiliki akses untuk halaman ini',
                SNACKBAR_OPTIONS,
            )
            break

        case 500:
            enqueueSnackbar(
                'Server bermasalah, silahkan menghubungi pengurus',
                SNACKBAR_OPTIONS,
            )
            break

        default:
            enqueueSnackbar(
                data.message ?? 'Terjadi kesalahan, silahkan coba lagi',
                SNACKBAR_OPTIONS,
            )
            break
    }
}
