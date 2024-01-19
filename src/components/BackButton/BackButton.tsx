// vendors
import { memo } from 'react'
import { useRouter } from 'next/router'
// materials
import Button, { ButtonProps } from '@mui/material/Button'
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const BackButton = memo(function BackButton(props: ButtonProps) {
    const { push, back } = useRouter()

    return (
        <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => (window.history.length > 1 ? back() : push('/'))}
            {...props}>
            Kembali
        </Button>
    )
})

export default BackButton
