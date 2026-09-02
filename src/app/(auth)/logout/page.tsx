'use client'

// vendors
import { useEffect } from 'react'
// components
import LoadingCenter from '@/components/statuses/loading-center'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'
import myAxios, { currentAuthInfoPromise } from '@/lib/axios'

export default function Page() {
    useLogout()

    return (
        <LoadingCenter>
            Sedang melakukan <i>logout</i>, harap tunggu.
        </LoadingCenter>
    )
}

function useLogout() {
    const [, setAuthInfo] = useAuthInfoState()

    useEffect(() => {
        currentAuthInfoPromise
            .then(() => myAxios.post('/logout'))
            .then(() => setAuthInfo(undefined))
    }, [setAuthInfo])
}
