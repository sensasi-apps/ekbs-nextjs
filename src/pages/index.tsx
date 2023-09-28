import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useAuth from '@/providers/Auth'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

export default function Index() {
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user === null) router.replace('/login')
        if (user) router.replace('/dashboard')
    }, [user])

    return <LoadingCenter />
}
