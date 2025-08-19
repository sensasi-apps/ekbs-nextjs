// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FooterBoxWithLogo from '@/components/footer-box-with-logo'

export default function NotFound() {
    return (
        <Container
            maxWidth="md"
            sx={{
                p: 16,
            }}>
            <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                alignItems="center"
                justifyContent="center"
                textAlign={{ xs: 'center', md: 'left' }}
                gap={4}>
                <Box
                    component="img"
                    src="/assets/illustrations/undraw_file-search_cbur.svg"
                    alt="404 Illustration"
                    sx={{
                        maxWidth: '50%',
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

            <FooterBoxWithLogo />
        </Container>
    )
}
