import Head from 'next/head'
import Link from 'next/link'
// materials
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
// etc
import FooterBox from '@/components/footer-box'

export default function NotFound({ layout }: { layout: 'root' | 'auth' }) {
    return (
        <Container
            style={{
                minHeight: layout === 'auth' ? 'unset' : '100vh',
                paddingTop: layout === 'auth' ? '3rem' : 'unset',
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

                {layout === 'auth' ? (
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

            {layout === 'root' && <FooterBox />}
        </Container>
    )
}
