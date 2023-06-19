import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import LockResetIcon from '@mui/icons-material/LockReset';

import AuthLayout from '@/components/Layouts/AuthLayout'

const PasswordReset = () => {
    const router = useRouter()

    const { resetPassword } = useAuth({ middleware: 'guest' })

    // form data
    const [email, setEmail] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [password, setPassword] = useState('')

    // ui data
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = event => {
        event.preventDefault()

        setErrors([])
        setStatus(null)
        setIsLoading(true)

        resetPassword({
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
            setStatus,
        })
    }

    useEffect(() => {
        setEmail(router.query.email || '')
    }, [router.query.email])

    useEffect(() => {
        const tempErrors = Object.values(errors);

        if (tempErrors.length > 0) {
            setStatus(tempErrors[0][0])
            setIsLoading(false)
        }

    }, [errors])

    return (
        <AuthLayout
            title="Atur kata sandi"
            icon={<LockResetIcon />}
            isLoading={isLoading}
            isError={Object.values(errors).length > 0}
            message={status}
        >
            <form onSubmit={submitForm} style={{ marginTop: '1rem' }}>
                <TextField
                    autoFocus
                    required
                    fullWidth
                    margin="normal"
                    label="Email Address"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    readOnly
                    disabled
                />

                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Kata sandi baru"
                    onChange={event => setPassword(event.target.value)}
                    type="password"
                    name="password"
                />

                <TextField
                    required
                    fullWidth
                    label="Ulangi kata sandi baru"
                    type="password"
                    name="password_confirmation"
                    onChange={event => setPasswordConfirmation(event.target.value)}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}
                >
                    Simpan kata sandi
                </Button>
            </form>
        </AuthLayout>
    )
}

export default PasswordReset
