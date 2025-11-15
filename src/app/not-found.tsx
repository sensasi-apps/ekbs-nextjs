// vendors

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import FooterBoxWithLogo from '@/components/footer-box-with-logo'
import NextLink from '@/components/next-link'

export default function NotFound() {
    return (
        <Container
            maxWidth="md"
            sx={{
                p: 16,
            }}>
            <Box
                alignItems="center"
                display="flex"
                flexDirection={{ md: 'row', xs: 'column' }}
                gap={4}
                justifyContent="center"
                textAlign={{ md: 'left', xs: 'center' }}>
                <Box
                    alt="404 Illustration"
                    component="img"
                    src="/assets/illustrations/undraw_file-search_cbur.svg"
                    sx={{
                        height: 'auto',
                        maxWidth: '50%',
                    }}
                />

                <Box>
                    <Typography fontWeight="bold" gutterBottom variant="h2">
                        Halaman tidak ditemukan
                    </Typography>

                    <Typography color="text.secondary" mb={6} variant="body1">
                        Sayang sekali, halaman yang anda tuju tidak ditemukan.
                    </Typography>

                    <Button
                        href="/"
                        LinkComponent={NextLink}
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        variant="outlined">
                        Kembali ke beranda
                    </Button>
                </Box>
            </Box>

            <FooterBoxWithLogo />
        </Container>
    )
}
