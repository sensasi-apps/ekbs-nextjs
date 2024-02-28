import AuthLayout from '@/components/Layouts/AuthLayout'
import UsersMainPageContent from '@/components/Users/MainPageContent'

export default function users() {
    return (
        <AuthLayout title="Pengguna">
            <UsersMainPageContent />
        </AuthLayout>
    )
}
