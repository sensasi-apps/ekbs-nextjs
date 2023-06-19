import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import SyncLockIcon from '@mui/icons-material/SyncLock';
import AuthLayout from '@/components/Layouts/AuthLayout'

const ForgotPassword = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    // form data
    const [email, setEmail] = useState('')

    // ui data
    const [isLoading, setIsLoading] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState('aswd')

    const submitForm = async event => {
        event.preventDefault()

        setIsLoading(true)

        try {
            await forgotPassword({ email, setErrors, setStatus })
            setIsComplete(true)
        } catch (error) {

        }

        setIsLoading(false)
    }

    return (
        <AuthLayout
            title="Lupa kata sandi"
            icon={<SyncLockIcon />}
            isLoading={isLoading}
            isComplete={isComplete}
            isError={errors.length > 0}
            message={status || errors.join(', ')}
        >
            <form onSubmit={submitForm} style={{ marginTop: '1rem' }}>
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
                    sx={{ mt: 3, mb: 1 }}
                >
                    Kirim tautan pengaturan kata sandi
                </Button>
                <Button
                    href="/login"
                    fullWidth
                >
                    Kembali ke halaman login
                </Button>
            </form>
        </AuthLayout>
    )
}

export default ForgotPassword
