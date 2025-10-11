'use client'

// icons
import LockResetIcon from '@mui/icons-material/LockReset'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
// vendors
import { type FormEvent, useState } from 'react'
// components
import GuestWithFormSubLayout from '@/app/(guest)/(with-form)/_parts/guest-with-form-sub-layout'
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'

export default function Page({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const [token, setToken] = useState<string>()
    const { push } = useRouter()

    params.then(({ token }) => setToken(token))

    const searchParam = useSearchParams()
    const email = searchParam?.get('email')

    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] =
        useState<LaravelValidationException>()

    function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formEl = event.currentTarget
        if (!formEl.checkValidity()) {
            formEl.reportValidity()
            return
        }

        setIsLoading(true)

        const formData = new FormData(formEl)

        axios
            .post('reset-password', formData)
            .then(() => {
                const response = btoa(
                    JSON.stringify({
                        message:
                            'Kata sandi berhasil diatur ulang. Silakan melakukan login dengan kata sandi baru Anda.',
                        status: 201,
                    }),
                )

                push(`/login?response=${response}`)
            })
            .catch((err: AxiosError<LaravelValidationException>) => {
                const { response } = err

                if (!response || response.status !== 422) throw err

                setValidationErrors(response.data)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <GuestWithFormSubLayout
            icon={<LockResetIcon />}
            isError={Boolean(validationErrors?.message)}
            isLoading={isLoading}
            message={validationErrors?.message.toString()}
            title="Atur kata sandi">
            <form
                autoComplete="off"
                onSubmit={submitForm}
                style={{ marginTop: '1rem' }}>
                <input
                    name="token"
                    readOnly
                    type="hidden"
                    value={token ?? ''}
                />

                <input
                    name="email"
                    readOnly
                    type="hidden"
                    value={email ?? ''}
                />

                <Box mb={2}>
                    <Typography variant="body2">Alamat email:</Typography>
                    <Typography variant="h6">{email}</Typography>
                </Box>

                <TextField
                    error={Boolean(validationErrors?.errors?.password)}
                    fullWidth
                    helperText={validationErrors?.errors?.password}
                    label="Kata sandi baru"
                    margin="normal"
                    name="password"
                    onChange={() => setValidationErrors(undefined)}
                    required
                    type="password"
                />

                <TextField
                    fullWidth
                    label="Ulangi kata sandi baru"
                    margin="dense"
                    name="password_confirmation"
                    required
                    type="password"
                />

                <Button
                    fullWidth
                    sx={{ mb: 1, mt: 3 }}
                    type="submit"
                    variant="contained">
                    Simpan kata sandi
                </Button>
            </form>
        </GuestWithFormSubLayout>
    )
}
