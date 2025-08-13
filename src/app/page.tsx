// components
import RedirectIfAuth from '@/components/redirect-if-auth'
// parts
import Landing from '@/app/_parts/landing'

export default function Page() {
    return (
        <>
            <RedirectIfAuth />
            <Landing />
        </>
    )
}
