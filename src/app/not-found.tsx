'use client'

import AuthLayout from '@/components/auth-layout'
import useAuthInfo from '@/hooks/use-auth-info'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FooterBoxWithLogo from '@/components/footer-box-with-logo'

export default function NotFound() {
    const isAuthenticated = Boolean(useAuthInfo())

    if (!isAuthenticated)
        return (
            <Box
                display="flex"
                flexDirection="column"
                height="100vh"
                justifyContent="center"
                alignItems="center"
                gap={4}>
                <Content />
                <FooterBoxWithLogo />
            </Box>
        )

    return (
        <AuthLayout>
            <Content />
        </AuthLayout>
    )
}

function Content() {
    return (
        <Container maxWidth="md">
            <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                alignItems="center"
                justifyContent="center"
                textAlign={{ xs: 'center', md: 'left' }}
                pt={4}
                gap={4}>
                <Box
                    component="img"
                    src="/assets/illustrations/undraw_file-search_cbur.svg"
                    alt="404 Illustration"
                    sx={{
                        maxWidth: { xs: '80%', md: '50%' },
                        height: 'auto',
                    }}
                />

                <Box>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Halaman tidak ditemukan
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={6}>
                        Sayang sekali, halaman yang anda tuju tidak ditemukan.
                    </Typography>

                    <Button
                        variant="outlined"
                        size="small"
                        href="/"
                        startIcon={<ArrowBackIcon />}>
                        Kembali ke beranda
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
