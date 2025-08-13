'use client'

// vendors
import { useRouter } from 'next/navigation'
// materials
import Button, { type ButtonProps } from '@mui/material/Button'
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function BackButton(props: ButtonProps) {
    const { push, back } = useRouter()

    return (
        <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => (window.history.length > 1 ? back() : push('/'))}
            {...props}>
            Kembali
        </Button>
    )
}
