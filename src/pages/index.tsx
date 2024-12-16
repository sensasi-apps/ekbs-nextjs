// vendors
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// component
import { Landing } from '@/components/pages/index/landing'
// providers
import useAuth from '@/providers/Auth'
import LogoLoadingBox from '@/components/LogoLoadingBox'

let timeout: NodeJS.Timeout

export default function Index() {
    const { replace } = useRouter()
    const { user } = useAuth()
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            if (user) {
                replace('/dashboard')
            } else {
                setShowContent(true)
            }
        }, 3000)
    }, [user, replace])

    return showContent ? <Landing /> : <LogoLoadingBox />
}
