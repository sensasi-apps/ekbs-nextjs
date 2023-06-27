import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import axios from '@/lib/axios'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import SyncLockIcon from '@mui/icons-material/SyncLock'
import GuestFormLayout from '@/components/Layouts/GuestFormLayout'

const ForgotPassword = () => {
    const router = useRouter()

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    // form data
    const [email, setEmail] = useState('')

    // ui data
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = event => {
        event.preventDefault()

        setErrors([])
        setStatus(null)
        setIsLoading(true)
        forgotPassword({ email, setErrors, setStatus })
    }

    useEffect(() => {
        const tempErrors = Object.values(errors)

        if (tempErrors.length > 0) {
            setIsLoading(false)
            setStatus(tempErrors[0][0])
        }
    }, [errors])

    return (
        <GuestFormLayout
            title="Lupa kata sandi"
            icon={<SyncLockIcon />}
            isLoading={isLoading}
            isError={Object.values(errors).length > 0}
            message={status}>
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
                    sx={{ mt: 3, mb: 1 }}>
                    Kirim tautan pengaturan kata sandi
                </Button>
            </form>
        </GuestFormLayout>
    )
}

export default ForgotPassword
