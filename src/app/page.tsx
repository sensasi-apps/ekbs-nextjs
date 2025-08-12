'use client'

// parts
import Landing from '@/app/_parts/landing'
// hooks
import { useGuestOnly } from '@/components/Layouts/@hooks/use-guest-only'

export default function Page() {
    useGuestOnly()

    return <Landing />
}
