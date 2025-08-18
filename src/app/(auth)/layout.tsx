import AuthLayout from '@/components/auth-layout'
import type { Metadata } from 'next'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthLayout>{children}</AuthLayout>
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
