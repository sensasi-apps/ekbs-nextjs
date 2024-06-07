import { useRouter } from 'next/router'
import { OptionsObject, enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'

const SNACKBAR_OPTIONS: OptionsObject = {
    variant: 'warning',
    persist: true,
}

export default function useDisablePage() {
    const { replace, back } = useRouter()

    useEffect(() => {
        enqueueSnackbar(
            'Halaman telah dinonaktifkan. Akan mengembalikan Anda ke halaman sebelumnya dalam 5 detik',
            SNACKBAR_OPTIONS,
        )

        setTimeout(() => {
            back()
        }, 5000)
    }, [replace, back])
}
