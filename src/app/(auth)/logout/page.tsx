'use client'

// vendors
import { useEffect } from 'react'
// components
import LoadingCenter from '@/components/statuses/loading-center'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'
import myAxios from '@/lib/axios'

export default function Page() {
    useLogout()

    return (
        <LoadingCenter>
            Sedang melakukan <i>logout</i>, harap tunggu.
        </LoadingCenter>
    )
}

function useLogout() {
    const [authInfo, setAuthInfo] = useAuthInfoState()

    useEffect(() => {
        if (!authInfo) return

        if (authInfo?.should_revoke_access_token_on_logout) {
            myAxios.post('/revoke-access-token')
        }

        setAuthInfo(undefined)
    }, [authInfo, setAuthInfo])
}
