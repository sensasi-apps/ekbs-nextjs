import { useEffect, useState, FormEvent } from 'react'
import axios from '@/lib/axios'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import SyncLockIcon from '@mui/icons-material/SyncLock'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GuestFormLayout from '@/components/Layouts/GuestFormLayout'
import CompleteCenter from '@/components/Statuses/CompleteCenter'

export default function ForgotPassword() {
    // form data
    const [email, setEmail] = useState('')

    // ui data
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<any[]>([])
    const [status, setStatus] = useState<string>()

    useEffect(() => {
        const tempErrors = Object.values(errors)

        if (tempErrors.length > 0) {
            setIsLoading(false)
            setStatus(tempErrors[0][0])
        }
    }, [errors])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setErrors([])
        setStatus(undefined)
        setIsLoading(true)

        return axios
            .post('/forgot-password', { email })
            .then(response => {
                setStatus(response.data.status)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
            .finally(() => setIsLoading(false))
    }

    const handleBack = () => {
        if (typeof window !== 'undefined') return history.back()
    }

    return (
        <GuestFormLayout
            title="Lupa kata sandi"
            icon={<SyncLockIcon />}
            isLoading={isLoading}
            isError={Object.values(errors).length > 0}
            message={status}>
            <CompleteCenter
                isShow={Boolean(status && Object.values(errors).length === 0)}
                message={status}
            />
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                <TextField
                    autoFocus
                    required
                    fullWidth
                    margin="normal"
                    id="email"
                    label="Email Address"
                    type="email"
                    name="email"
                    autoComplete="email"
                    onChange={event => setEmail(event.target.value)}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}>
                    Kirim tautan pengaturan kata sandi
                </Button>
            </form>

            <Button
                variant="text"
                size="small"
                startIcon={<ArrowBackIcon />}
                sx={{ mt: 3, mb: 1 }}
                onClick={handleBack}>
                Kembali
            </Button>
        </GuestFormLayout>
    )
}
