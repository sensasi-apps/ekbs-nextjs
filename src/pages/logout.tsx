// vendors
import { useEffect, useRef } from 'react'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
// etc
import useAuth from '@/providers/Auth'

export default function LogoutPage() {
    const { logout } = useAuth()
    const isLoggingOut = useRef(false)

    useEffect(() => {
        if (!isLoggingOut.current) {
            isLoggingOut.current = true

            logout()
        }
    }, [logout])

    return (
        <AuthLayout title="Logout">
            <LoadingCenter>
                Sedang melakukan <i>logout</i>, harap tunggu.
            </LoadingCenter>
        </AuthLayout>
    )
}
