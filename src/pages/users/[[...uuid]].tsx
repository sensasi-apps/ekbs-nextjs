import AuthLayout from '@/components/Layouts/AuthLayout'
import UsersMainPageContent from '@/components/Users/MainPageContent'
import { UserWithDetailsProvider } from '@/providers/UserWithDetails'

export default function users() {
    return (
        <AuthLayout title="Pengguna">
            <UserWithDetailsProvider>
                <UsersMainPageContent />
            </UserWithDetailsProvider>
        </AuthLayout>
    )
}
