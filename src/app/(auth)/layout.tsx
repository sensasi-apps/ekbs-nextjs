import AuthLayout from '@/components/auth-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthLayout title="">{children}</AuthLayout>
}
