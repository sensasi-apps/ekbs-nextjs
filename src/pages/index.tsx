// vendors
// import { useEffect, useState } from 'react'
// component
import { Landing } from '@/components/pages/index/landing'
// providers
// import useAuth from '@/providers/Auth'
// import LogoLoadingBox from '@/components/LogoLoadingBox'
// import { useDebouncedCallback } from 'use-debounce'
import { useGuestOnly } from '@/components/Layouts/@hooks/use-guest-only'

// let isDelayingShowContent = false

export default function Index() {
    useGuestOnly()

    // const { user } = useAuth()
    // const [showContent, setShowContent] = useState(!isDelayingShowContent)

    // if (user === undefined) {
    //     isDelayingShowContent = true
    // }

    // const showContentDebounce = useDebouncedCallback(() => {
    //     setShowContent(true)
    //     isDelayingShowContent = false
    // }, 2000)

    // useEffect(() => {
    //     if (isDelayingShowContent) {
    //         showContentDebounce()
    //     }
    // }, [showContentDebounce])

    // return user === null && showContent ? <Landing /> : <LogoLoadingBox />

    return <Landing />
}
