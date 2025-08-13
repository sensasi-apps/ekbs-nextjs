'use client'

import { useRouter } from 'next/navigation'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Fab from '@mui/material/Fab'

export default function GuestBackButton() {
    const { back, push } = useRouter()

    return (
        <Fab
            variant="extended"
            color="warning"
            onClick={() => (window.history.length > 1 ? back() : push('/'))}
            sx={{
                display: {
                    xs: 'none',
                    sm: 'none',
                    md: 'inline-flex',
                },
                backgroundColor:
                    'hsl(from var(--mui-palette-warning-dark) h s l / 20%)',
                '&:hover': {
                    backgroundColor:
                        'hsl(from var(--mui-palette-warning-dark) h s l / 40%)',
                },
                pr: 3,
            }}>
            <ArrowBack sx={{ mr: 1 }} />
            Kembali
        </Fab>
    )
}
