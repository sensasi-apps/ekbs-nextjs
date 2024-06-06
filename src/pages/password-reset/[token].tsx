// vandors
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// icons
import LockResetIcon from '@mui/icons-material/LockReset'
// components
import GuestFormLayout from '@/components/Layouts/GuestFormLayout'
import useValidationErrors from '@/hooks/useValidationErrors'

export default function PasswordReset() {
    const {
        push,
        query: { token, email },
    } = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const { validationErrors, setValidationErrors, clearByEvent } =
        useValidationErrors()

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget
        if (!formEl.checkValidity()) {
            formEl.reportValidity()
            return
        }

        setIsLoading(true)

        const formData = new FormData(formEl)

        return axios
            .post<string>('/reset-password', formData)
            .then(({ data }) => push('/login?response=' + btoa(data)))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setValidationErrors(error.response.data.errors)
            })
    }

    return (
        <GuestFormLayout
            title="Atur kata sandi"
            icon={<LockResetIcon />}
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
                <TextField
                    autoFocus
                    required
                    fullWidth
                    margin="normal"
                    label="Email Address"
                    type="email"
                    name="email"
                    value={email ?? ''}
                    inputProps={{
                        readOnly: true,
                    }}
                    error={Boolean(validationErrors.email)}
                    helperText={validationErrors.password}
                />

                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Kata sandi baru"
                    type="password"
                    name="password"
                    onChange={clearByEvent}
                    error={Boolean(validationErrors.password)}
                    helperText={validationErrors.password}
                />

                <TextField
                    required
                    fullWidth
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
