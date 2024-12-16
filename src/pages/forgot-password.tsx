// types
import { AxiosError } from 'axios'
// vendors
import { useState, FormEvent } from 'react'
import axios from '@/lib/axios'
// materials
import { Box, Button, Fab, TextField } from '@mui/material'
// icons
import SyncLockIcon from '@mui/icons-material/SyncLock'
// components
import BackButton from '@/components/BackButton'
import CompleteCenter from '@/components/Statuses/CompleteCenter'
import GuestFormLayout from '@/components/Layouts/guest-form'

export default function ForgotPassword() {
    // form data
    const [email, setEmail] = useState('')

    // ui data
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>()

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setIsError(false)
        setMsg(undefined)
        setIsLoading(true)

        axios
            .post<{
                message: string
            }>('/forgot-password', { email })
            .then(({ data: { message } }) => {
                setMsg(message)
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

    return (
        <GuestFormLayout
            title="Lupa kata sandi"
            icon={<SyncLockIcon />}
            isLoading={isLoading}
            isError={isError}
            message={msg}>
            {!isError && Boolean(msg) && (
                <>
                    <CompleteCenter message={msg} />

                    <Box display="flex" mt={-3} mb={1} justifyContent="center">
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => close()}>
                            Tutup halaman
                        </Button>
                    </Box>
                </>
            )}

            {!(!isError && Boolean(msg)) && (
                <>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            margin="normal"
                            id="email"
                            label="Alamat email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            onChange={event => setEmail(event.target.value)}
                        />

                        <Fab
                            type="submit"
                            variant="extended"
                            color="primary"
                            sx={{ mt: 3, mb: 1 }}>
                            Atur ulang kata sandi
                        </Fab>
                    </form>
                </>
            )}
            <BackButton sx={{ mt: 2 }} />
        </GuestFormLayout>
    )
}
