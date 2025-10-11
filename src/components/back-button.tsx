'use client'

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// materials
import Button, { type ButtonProps } from '@mui/material/Button'
// vendors
import { useRouter } from 'next/navigation'

export default function BackButton(props: ButtonProps) {
    const { push, back } = useRouter()

    return (
        <Button
            onClick={() => (window.history.length > 1 ? back() : push('/'))}
            startIcon={<ArrowBackIcon />}
            {...props}>
            Kembali
        </Button>
    )
}
