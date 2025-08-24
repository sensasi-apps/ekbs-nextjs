import ContentGuard from '@/components/content-guard'
import RedirectIfUnauth from '@/components/redirect-if-unauth'
import The401Protection from '@/components/the-401-protection'
import type { Metadata } from 'next'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RedirectIfUnauth />
            <The401Protection />
            <ContentGuard>{children}</ContentGuard>
        </>
    )
}

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            'max-video-preview': -1,
            'max-snippet': -1,
        },
    },
}
