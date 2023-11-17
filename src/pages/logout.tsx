import { useEffect } from 'react'
import axios from '@/lib/axios'

import AuthLayout from '@/components/Layouts/AuthLayout'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import useAuth from '@/providers/Auth'

const logout = () =>
    axios.post('/logout').catch(error => {
        if (![401, 422].includes(error.response.status)) throw error
    })

const LogoutPage = () => {
    const { onLogoutSuccess } = useAuth()

    useEffect(() => {
        logout().then(onLogoutSuccess)
    }, [])

    return (
        <AuthLayout title="Logout">
            <LoadingCenter>
                Sedang melakukan <i>logout</i>, harap tunggu.
            </LoadingCenter>
        </AuthLayout>
    )
}

export default LogoutPage
