import type { Metadata } from 'next'
import ContentGuard from '@/components/content-guard'
import RedirectIfUnauth from '@/components/redirect-if-unauth'
import The401Protection from '@/components/the-401-protection'

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
        follow: false,
        googleBot: {
            follow: false,
            index: false,
            'max-snippet': -1,
            'max-video-preview': -1,
            noimageindex: true,
        },
        index: false,
        nocache: true,
    },
}
