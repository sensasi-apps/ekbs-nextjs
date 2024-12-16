// vendors
import { useEffect } from 'react'
import { useRouter } from 'next/router'
// component
import { Landing } from '@/components/pages/index/landing'
// providers
import useAuth from '@/providers/Auth'

export default function Index() {
    const { replace } = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            replace('/dashboard')
        }
    }, [user, replace])

    return <Landing />
}
