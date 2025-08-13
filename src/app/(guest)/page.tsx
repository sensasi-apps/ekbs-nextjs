// components
import RedirectIfAuth from '@/components/redirect-if-auth'
// parts
import Landing from '@/app/(guest)/_parts/landing'

export default function Page() {
    return (
        <>
            <RedirectIfAuth />
            <Landing />
        </>
    )
}
