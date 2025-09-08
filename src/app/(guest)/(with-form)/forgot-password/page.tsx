import ForgotPasswordPageClient from './page-client'

export const metadata = {
    title: `Lupa kata sandi — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

export default function Page() {
    return <ForgotPasswordPageClient />
}
