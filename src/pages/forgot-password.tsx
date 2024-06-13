// types
import { AxiosError } from 'axios'
// vendors
import { useState, FormEvent } from 'react'
import axios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// icons
import SyncLockIcon from '@mui/icons-material/SyncLock'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// components
import GuestFormLayout from '@/components/Layouts/GuestFormLayout'
import CompleteCenter from '@/components/Statuses/CompleteCenter'

export default function ForgotPassword() {
    // form data
    const [email, setEmail] = useState('')

    // ui data
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setIsError(false)
        setMsg(undefined)
        setIsLoading(true)

        return axios
            .post('/forgot-password', { email })
            .then(response => {
                setMsg(response.data.status)
            })
            .catch(
                ({
                    response,
                    message,
                }: AxiosError<{
                    // php / laravel exception
                    message?: string
                }>) => {
                    setIsError(true)
                    setMsg(
                        response?.data.message ??
                            response?.statusText ??
                            message,
                    )
                },
            )
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
            isError={isError}
            message={msg}>
            <CompleteCenter isShow={!isError && Boolean(msg)} message={msg} />
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
