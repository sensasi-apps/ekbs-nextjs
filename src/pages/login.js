import { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/auth'

import { useRouter } from 'next/router'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import GuestLayout from '@/components/Layouts/GuestLayout'

const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (router.query.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    })

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setLoading(false);
        }
    }, [errors])

    const submitForm = async event => {
        event.preventDefault();

        setLoading(true);

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <GuestLayout>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>

                    {
                        loading ?
                            <Box textAlign='center' mt={4}>
                                <CircularProgress />
                            </Box> :
                            <>
                                {
                                    Object.keys(errors).length > 0 && <Paper elevation={3} sx={{ backgroundColor: "#ef5350", color: "#FFF", p: 2, mt: 2, mb: 2, width: '100%', maxWidth: '400px' }}>
                                        {
                                            Object.keys(errors).map((key, index) => {
                                                return (
                                                    <Typography key={index} variant="body2" align="center">
                                                        {errors[key]}
                                                    </Typography>
                                                )
                                            })
                                        }
                                    </Paper>
                                }
                                <Box component="form" onSubmit={submitForm} noValidate sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
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
                                    <Grid container>
                                        <Grid item xs>
                                            <Link href="#" variant="body2">
                                                Lupa password?
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                    }
                </Box>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
                    {'Copyright © '}
                    <Link color="inherit" href="https://github.com/sensasi-apps" target='_blank'>
                        Sensasi Apps
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </GuestLayout>

    )
}

export default Login
