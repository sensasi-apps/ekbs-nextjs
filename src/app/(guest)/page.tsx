// components

// parts
import Landing from '@/app/(guest)/_parts/landing'
import RedirectIfAuth from '@/components/redirect-if-auth'

export default function Page() {
    return (
        <>
            <RedirectIfAuth />
            <Landing />
        </>
    )
}
