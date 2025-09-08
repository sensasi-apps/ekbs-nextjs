'use client'

// types
import { AxiosError } from 'axios'
// vendors
import { useState, type FormEvent } from 'react'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import TextField from '@mui/material/TextField'
// icons
import SyncLockIcon from '@mui/icons-material/SyncLock'
// components
import BackButton from '@/components/back-button'
import CompleteCenter from '@/components/Statuses/CompleteCenter'
import GuestWithFormSubLayout from '@/app/(guest)/(with-form)/_parts/guest-with-form-sub-layout'

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
            title="Lupa kata sandi"
            icon={<SyncLockIcon />}
            isLoading={isLoading}
            isError={isError}
            message={msg}>
            {isNotErrorAndHasMsg && <CompleteCenter message={msg} />}

            {!isNotErrorAndHasMsg && (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    autoComplete="off">
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
                </Box>
            )}
            <BackButton sx={{ mt: 2 }} />
        </GuestWithFormSubLayout>
    )
}
