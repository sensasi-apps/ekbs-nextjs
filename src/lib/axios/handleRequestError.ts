import type { AxiosError } from 'axios'
import { enqueueSnackbar } from 'notistack'

let timoutId: NodeJS.Timeout | undefined

function preventThrottling() {
    timoutId = setTimeout(() => {
        clearTimeout(timoutId)
        timoutId = undefined
    }, 1000)
}

export default function handleRequestError({ code, config }: AxiosError) {
    if (code === 'ERR_NETWORK' && !timoutId) {
        if (!navigator.onLine) {
            const type = config?.method === 'get' ? 'mengambil' : 'mengirim'

            enqueueSnackbar(
                `Tidak dapat ${type} data karena Anda sedang offline`,
                {
                    variant: 'error',
                    persist: true,
                },
            )
        } else {
            enqueueSnackbar(
                'Server EKBS tidak merespon, mohon coba lagi nanti.',
                {
                    variant: 'error',
                    persist: true,
                },
            )
        }

        preventThrottling()
    }
}
