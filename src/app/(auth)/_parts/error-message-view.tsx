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
                alignItems="center"
                display="flex"
                flexDirection={{ md: 'row', xs: 'column' }}
                gap={4}
                justifyContent="center"
                pt={4}
                textAlign={{ md: 'left', xs: 'center' }}>
                <Box
                    alt={`${code} Illustration`}
                    component="img"
                    src={error.image}
                    sx={{
                        height: 'auto',
                        maxWidth: { md: '50%', xs: '80%' },
                    }}
                />

                <Box>
                    <Typography fontWeight="bold" gutterBottom variant="h2">
                        {error.title}
                    </Typography>

                    <Typography color="text.secondary" mb={6} variant="body1">
                        {error.message}
                    </Typography>

                    <Typography color="textDisabled" variant="caption">
                        Silakan hubungi admin jika Anda merasa ini adalah
                        kekeliruan.
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

const ERRORS = {
    403: {
        image: '/assets/illustrations/undraw_secure-server_lz9x.svg',
        message: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
        title: 'Akses Ditolak',
    },

    inactive: {
        image: '/assets/illustrations/undraw_security_0ubl.svg',
        message: 'Akun anda belum aktif atau telah dinonaktifkan.',
        title: 'Akun Tidak Aktif',
    },
}
