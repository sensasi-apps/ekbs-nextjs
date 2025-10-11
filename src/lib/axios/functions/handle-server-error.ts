import type { AxiosResponse } from 'axios'
import { enqueueSnackbar, type OptionsObject } from 'notistack'
import SNACKBAR_419_OPTIONS from '../SNACKBAR_419_OPTIONS'

const SNACKBAR_OPTIONS: OptionsObject = {
    persist: true,
    variant: 'error',
}

export function handleServerError({ status, data }: AxiosResponse) {
    if (status === 419 && data.message === 'CSRF token mismatch.') {
        enqueueSnackbar(
            'Halaman telah kadaluarsa, peramban akan disegarkan dalam 10 detik.',
            SNACKBAR_419_OPTIONS,
        )

        setTimeout(() => {
            location.reload()
        }, 10000)

        return
    }

    switch (status) {
        case 401:
            /**
             * Handled at 'layout/auth-layout.401-protection.tsx`
             */
            dispatchEvent(new CustomEvent('401Error'))
            break

        case 422:
            // add 422 case to prevent default error message
            // validation error are handled on each form
            break

        case 403:
            enqueueSnackbar(
                data.message ?? 'Anda tidak memiliki akses untuk halaman ini',
                SNACKBAR_OPTIONS,
            )
            break

        case 500:
            enqueueSnackbar(
                'Terjadi eror pada server.' +
                    (data.message === 'Server Error' ? '' : ` ${data.message}`),
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
