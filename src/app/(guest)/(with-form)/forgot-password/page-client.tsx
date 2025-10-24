'use client'

// icons
import SyncLockIcon from '@mui/icons-material/SyncLock'
// materials
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import TextField from '@mui/material/TextField'
// types
import type { AxiosError } from 'axios'
// vendors
import { type FormEvent, useState } from 'react'
import GuestWithFormSubLayout from '@/app/(guest)/(with-form)/_parts/guest-with-form-sub-layout'
// components
import BackButton from '@/components/back-button'
import CompleteCenter from '@/components/Statuses/CompleteCenter'
import axios from '@/lib/axios'

export default function ForgotPasswordPageClient() {
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

    const isNotErrorAndHasMsg = !isError && Boolean(msg)

    return (
        <GuestWithFormSubLayout
            icon={<SyncLockIcon />}
            isError={isError}
            isLoading={isLoading}
            message={msg}
            title="Lupa kata sandi">
            {isNotErrorAndHasMsg && <CompleteCenter message={msg} />}

            {!isNotErrorAndHasMsg && (
                <Box
                    autoComplete="off"
                    component="form"
                    onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        fullWidth
                        id="email"
                        label="Alamat email"
                        margin="normal"
                        name="email"
                        onChange={event => setEmail(event.target.value)}
                        required
                        type="email"
                    />

                    <Fab
                        color="primary"
                        sx={{ mb: 1, mt: 3 }}
                        type="submit"
                        variant="extended">
                        Atur ulang kata sandi
                    </Fab>
                </Box>
            )}
            <BackButton sx={{ mt: 2 }} />
        </GuestWithFormSubLayout>
    )
}
