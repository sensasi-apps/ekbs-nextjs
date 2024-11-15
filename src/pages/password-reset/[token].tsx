import type { AxiosError } from 'axios'
import type LaravelValidationException from '@/types/LaravelValidationException'
// vandors
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
// materials
import { Box, Button, TextField, Typography } from '@mui/material'
// icons
import LockResetIcon from '@mui/icons-material/LockReset'
// components
import GuestFormLayout from '@/components/Layouts/GuestFormLayout'

export default function PasswordReset() {
    const {
        push,
        query: { token, email },
    } = useRouter()

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
            .then(() =>
                push(
                    '/login?response=' +
                        btoa(
                            JSON.stringify({
                                status: 201,
                                message:
                                    'Kata sandi berhasil diatur ulang. Silakan melakukan login dengan kata sandi baru Anda.',
                            }),
                        ),
                ),
            )
            .catch((err: AxiosError<LaravelValidationException>) => {
                const { response } = err

                if (!response || response.status !== 422) throw err

                setValidationErrors(response.data)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <GuestFormLayout
            title="Atur kata sandi"
            icon={<LockResetIcon />}
            isError={Boolean(validationErrors?.message)}
            message={validationErrors?.message.toString()}
            isLoading={isLoading}>
            <form
                onSubmit={submitForm}
                style={{ marginTop: '1rem' }}
                autoComplete="off">
                <input
                    type="hidden"
                    name="token"
                    value={token ?? ''}
                    readOnly
                />

                <input
                    type="hidden"
                    name="email"
                    value={email ?? ''}
                    readOnly
                />

                <Box mb={2}>
                    <Typography variant="body2">Alamat email:</Typography>
                    <Typography variant="h6">{email}</Typography>
                </Box>

                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Kata sandi baru"
                    type="password"
                    name="password"
                    onChange={() => setValidationErrors(undefined)}
                    error={Boolean(validationErrors?.errors?.password)}
                    helperText={validationErrors?.errors?.password}
                />

                <TextField
                    required
                    fullWidth
                    margin="dense"
                    label="Ulangi kata sandi baru"
                    type="password"
                    name="password_confirmation"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}>
                    Simpan kata sandi
                </Button>
            </form>
        </GuestFormLayout>
    )
}
