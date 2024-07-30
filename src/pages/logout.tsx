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

            axios
                .post('/logout')
                .then(onLogoutSuccess)
                .catch((error: AxiosError) => {
                    if (
                        // all of these status code could be considered as "user is not logged in"
                        // 401: Unauthorized (user is not logged in)
                        // 419: CSRF token mismatch
                        [401, 419, undefined].includes(error.response?.status)
                    ) {
                        onLogoutSuccess()
                    } else {
                        throw error
                    }
                })
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
