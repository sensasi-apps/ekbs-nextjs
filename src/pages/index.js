import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Index() {
    const router = useRouter()

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        if (isLoggedIn) router.replace('/dashboard')
        if (!isLoggedIn) router.replace('/login')
    }, [])
}
