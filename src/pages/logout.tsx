import type { AxiosError } from 'axios'
// vendors
import { useEffect, useRef } from 'react'
import axios from '@/lib/axios'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
// etc
import useAuth from '@/providers/Auth'

export default function LogoutPage() {
    const { onLogoutSuccess } = useAuth()
    const isLoggingOut = useRef(false)

    useEffect(() => {
        if (!isLoggingOut.current) {
            isLoggingOut.current = true
            axios.post('/logout').then(onLogoutSuccess).catch(HANDLE_CATCH)
        }
    }, [onLogoutSuccess])

    return (
        <AuthLayout title="Logout">
            <LoadingCenter>
                Sedang melakukan <i>logout</i>, harap tunggu.
            </LoadingCenter>
        </AuthLayout>
    )
}

function HANDLE_CATCH(error: AxiosError) {
    if ([401, 419, 422, undefined].includes(error.response?.status)) {
        // do nothing
    } else {
        throw error
    }
}
