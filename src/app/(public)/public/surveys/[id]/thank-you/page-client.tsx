'use client'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import PageTitle from '@/components/page-title'

export default function ThankYouPageClient() {
    const { push } = useRouter()

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 6 }}>
                    <CheckCircleIcon
                        sx={{
                            color: 'success.main',
                            fontSize: 80,
                            mb: 3,
                        }}
                    />

                    <PageTitle title="Terima Kasih!" />

                    <Typography
                        sx={{ color: 'text.secondary', mb: 2 }}
                        variant="h6">
                        Jawaban Anda telah berhasil dikirim
                    </Typography>

                    <Typography
                        sx={{ color: 'text.secondary', mb: 4 }}
                        variant="body1">
                        Terima kasih telah meluangkan waktu untuk mengisi survey
                        ini. Jawaban Anda sangat berarti bagi kami.
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                        }}>
                        <Button
                            onClick={() => push('/')}
                            size="large"
                            variant="outlined">
                            Kembali ke Beranda
                        </Button>
                        <Button
                            onClick={() => window.close()}
                            size="large"
                            variant="contained">
                            Tutup Halaman
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )
}
