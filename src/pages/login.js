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
import CompleteCenter from '@/components/Statuses/CompleteCenter'

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
        const reset = new URLSearchParams(window.location.search).get('reset');
        if (reset) {
            setStatus(atob(reset))
        } else {
            setStatus(null)
        }

        const error = new URLSearchParams(window.location.search).get('error');
        if (error) {
            setErrors([[atob(error)]]);
        }
    }, []);

    useEffect(() => {
        const tempErrors = Object.values(errors);

        if (tempErrors.length > 0) {
            setIsLoading(false);
            setStatus(tempErrors[0][0])
        }

    }, [errors])

    const submitForm = event => {
        event.preventDefault();

        setErrors([])
        setStatus(null)
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
            isError={Object.values(errors).length > 0}
            message={status}
        >
            <CompleteCenter isShow={router.query.reset?.length > 0 && errors.length === 0} message={status} />

            <Box component="form" onSubmit={submitForm}>
                <TextField
                    autoFocus
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    name="email"
                    autoComplete="email"
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
