import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GoogleIcon from '@mui/icons-material/Google'

import AuthLayout from '@/components/Layouts/AuthLayout'

const Login = () => {
    const router = useRouter();

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    // form data
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)

    // ui data
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (router.query.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    })

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setIsLoading(false);
        }
    }, [errors])



    useEffect(() => {
        const error = new URLSearchParams(window.location.search).get('error');

        if (error) {
            setErrors([error]);
        }
    }, []);

    const submitForm = async event => {
        event.preventDefault();

        setIsLoading(true);

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <AuthLayout
            title="Login"
            icon={<LockOutlinedIcon />}
            isLoading={isLoading}
            isError={errors.length > 0}
            message={status || errors.join(', ')}
        >
            <Box component="form" onSubmit={submitForm}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    name="email"
                    autoComplete="email"
                    autoFocus

                    onChange={event => setEmail(event.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"

                    onChange={event => setPassword(event.target.value)}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                    onChange={event => setShouldRemember(event.target.checked)}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                <Link href="/forgot-password" variant="body2">
                    Lupa password?
                </Link>
            </Box>
            <Box width='100%'>
                <Divider sx={{
                    my: 2,
                }}>Atau</Divider>

                <Button
                    fullWidth
                    color='inherit'
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    onClick={() => router.push('/api/oauth/google')}
                >Login dengan Google</Button>
            </Box>
        </AuthLayout>
    )
}

export default Login
