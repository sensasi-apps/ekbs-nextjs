import type { Metadata } from 'next'
import AuthLayout from '@/components/auth-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthLayout>{children}</AuthLayout>
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
