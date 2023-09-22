import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'

import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import GuestFormLayout from '@/components/Layouts/GuestFormLayout'
import CompleteCenter from '@/components/Statuses/CompleteCenter'
import useAuth from '@/providers/Auth'
import axios from '@/lib/axios'

const LoginPage = () => {
    const router = useRouter()
    const { onLoginSuccess } = useAuth()

    // ui data
    const [errors, setErrors] = useState<any[]>([])
    const [status, setStatus] = useState<string | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)

    // redirection back handler
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        const reset = params.get('reset')
        if (reset) {
            setStatus(atob(reset))
        } else {
            setStatus(undefined)
        }

        const error = params.get('reset')
        if (error) {
            setErrors([[atob(error)]])
        }

        const responseFromApi = params.get('response')
        if (responseFromApi) {
            let response
            try {
                response = JSON.parse(atob(responseFromApi))
            } catch (error) {
                response = { status: 500, message: 'Terjadi kesalahan' }
            }

            if (response.status !== 200) {
                setErrors([[response.message]])
            }

            if (response.status === 200) {
                setIsLoading(true)

                axios
                    .get('/api/user')
                    .then(res => res.data)
                    .then(onLoginSuccess)
                    .catch(() => {
                        setErrors([['Terjadi kesalahan, silahkan coba lagi']])
                        setIsLoading(false)
                    })
            }
        }
    }, [])

    useEffect(() => {
        const tempErrors = Object.values(errors)

        if (tempErrors.length > 0) {
            setIsLoading(false)
            setStatus(tempErrors[0][0])
        }
    }, [errors])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget

        if (!formEl.checkValidity()) {
            formEl.reportValidity()
            return
        }

        setErrors([])
        setStatus(undefined)
        setIsLoading(true)

        const loginData = new FormData(formEl)

        axios
            .post('/login', loginData)
            .then(res => res.data)
            .then(user => {
                onLoginSuccess(user)
            })
            .catch(error => {
                if (error.response) {
                    const { data } = error.response

                    if (data.errors) {
                        setErrors(Object.values(data.errors))
                    } else {
                        setErrors([[data.message]])
                    }
                } else {
                    setErrors([['Terjadi kesalahan, silahkan coba lagi']])
                }

                setIsLoading(false)
            })
    }

    return (
        <GuestFormLayout
            title="Login"
            icon={<LockOutlinedIcon />}
            isLoading={isLoading}
            isError={Object.values(errors).length > 0}
            message={status}>
            <CompleteCenter
                isShow={
                    (router.query.reset?.length ?? 0) > 0 && errors.length === 0
                }
                message={status}
            />

            <Box component="form" onSubmit={handleSubmit} autoComplete="off">
                <TextField
                    margin="normal"
                    required
                    inputProps={{
                        autoComplete: 'off',
                    }}
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    name="email"
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="off"
                />

                <FormControlLabel
                    name="remember"
                    control={<Checkbox value="true" color="primary" />}
                    label="Remember me"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
                <Link href="/forgot-password" variant="body2">
                    Lupa password?
                </Link>
            </Box>

            <Divider
                sx={{
                    my: 2,
                }}>
                Atau
            </Divider>

            <Button
                href="/api/oauth/google"
                fullWidth
                color="inherit"
                variant="contained"
                startIcon={<GoogleIcon />}>
                Login dengan Google
            </Button>
        </GuestFormLayout>
    )
}

export default LoginPage
