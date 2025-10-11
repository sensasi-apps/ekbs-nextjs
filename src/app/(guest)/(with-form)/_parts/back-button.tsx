'use client'

import ArrowBack from '@mui/icons-material/ArrowBack'
import Fab from '@mui/material/Fab'
import { useRouter } from 'next/navigation'

export default function GuestBackButton() {
    const { back, push } = useRouter()

    return (
        <Fab
            color="warning"
            onClick={() => (window.history.length > 1 ? back() : push('/'))}
            sx={{
                '&:hover': {
                    backgroundColor:
                        'hsl(from var(--mui-palette-warning-dark) h s l / 40%)',
                },
                backgroundColor:
                    'hsl(from var(--mui-palette-warning-dark) h s l / 20%)',
                display: {
                    md: 'inline-flex',
                    sm: 'none',
                    xs: 'none',
                },
                pr: 3,
            }}
            variant="extended">
            <ArrowBack sx={{ mr: 1 }} />
            Kembali
        </Fab>
    )
}
