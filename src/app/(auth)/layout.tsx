import AuthLayout from '@/components/Layouts/AuthLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthLayout title="">{children}</AuthLayout>
}
