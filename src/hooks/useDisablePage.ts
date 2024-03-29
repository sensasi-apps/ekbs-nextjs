import { useRouter } from 'next/router'
import { OptionsObject, enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'

const SNACKBAR_OPTIONS: OptionsObject = {
    variant: 'error',
    persist: true,
}

export default function useDisablePage() {
    const { replace } = useRouter()

    useEffect(() => {
        enqueueSnackbar('Halaman telah dinonaktifkan', SNACKBAR_OPTIONS)

        replace('/dashboard')
    }, [])
}
