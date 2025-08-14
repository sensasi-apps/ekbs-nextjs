// materials
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function ErrorMessageView({
    code,
}: {
    code: keyof typeof ERRORS
}) {
    const error = ERRORS[code]

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
                    src={error.image}
                    alt={`${code} Illustration`}
                    sx={{
                        maxWidth: { xs: '80%', md: '50%' },
                        height: 'auto',
                    }}
                />

                <Box>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        {error.title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={3}>
                        {error.message}
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

const ERRORS = {
    403: {
        title: 'Akses Ditolak',
        message:
            'Kamu tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi admin jika kamu merasa ini adalah kesalahan.',
        image: '/assets/illustrations/undraw_secure-server_lz9x.svg',
    },
}
