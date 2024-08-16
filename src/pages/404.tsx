import Head from 'next/head'
import Link from 'next/link'
// materials
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
// etc
import useAuth from '@/providers/Auth'
import AuthLayout from '@/components/Layouts/AuthLayout'
import FooterBox from '@/components/Layouts/FooterBox'

export default function NotFoundPage() {
    const { user } = useAuth()

    const isAuthenticated = Boolean(user)

    const mainContent = (
        <Container
            style={{
                minHeight: isAuthenticated ? 'unset' : '100vh',
                paddingTop: isAuthenticated ? '3rem' : 'unset',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
            <Head>
                <title>{`Halaman tidak ditemukan — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <div>
                <HelpOutlineIcon style={{ fontSize: 150 }} color="warning" />
            </div>

            <div>
                <h1>
                    <div>404</div>
                    <div>Halaman tidak ditemukan</div>
                </h1>
                <p>Sayang sekali, halaman yang anda tuju tidak ditemukan.</p>

                {isAuthenticated ? (
                    <p>Silakan memilih menu yang tersedia di sebelah kiri.</p>
                ) : (
                    <Button
                        variant="outlined"
                        size="small"
                        href="/login"
                        LinkComponent={Link}
                        startIcon={<ArrowBackIcon />}>
                        Kembali ke halaman Login
                    </Button>
                )}
            </div>

            <FooterBox />
        </Container>
    )

    return isAuthenticated ? (
        <AuthLayout title="Halaman tidak ditemukan">{mainContent}</AuthLayout>
    ) : (
        mainContent
    )
}
