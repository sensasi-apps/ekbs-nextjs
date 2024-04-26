import type { AxiosError } from 'axios'
// vendors
import { useEffect } from 'react'
import axios from '@/lib/axios'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
// etc
import useAuth from '@/providers/Auth'

export default function LogoutPage() {
    const { onLogoutSuccess } = useAuth()

    useEffect(() => {
        axios
            .post('/logout')
            .catch((error: AxiosError) => {
                if (
                    ![401, 419, 422, undefined].includes(error.response?.status)
                )
                    throw error
            })
            .then(onLogoutSuccess)
    }, [])

    return (
        <AuthLayout title="Logout">
            <LoadingCenter>
                Sedang melakukan <i>logout</i>, harap tunggu.
            </LoadingCenter>
        </AuthLayout>
    )
}
