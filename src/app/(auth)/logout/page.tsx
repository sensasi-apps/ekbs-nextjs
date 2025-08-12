'use client'

// vendors
import type AuthInfo from '@/features/user--auth/types/auth-info'
import { useLocalStorage } from '@uidotdev/usehooks'
// components
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import myAxios from '@/lib/axios'
import { LS_KEY } from '@/hooks/use-auth-info'
// etc

export default function Page() {
    useLogout()

    return (
        <LoadingCenter>
            Sedang melakukan <i>logout</i>, harap tunggu.
        </LoadingCenter>
    )
}

function useLogout() {
    const [authInfo, setAuthInfo] = useLocalStorage<AuthInfo | undefined>(
        LS_KEY,
    )

    if (authInfo?.should_revoke_access_token_on_logout) {
        myAxios.post('/revoke-access-token')
    }

    setAuthInfo(undefined)
}
