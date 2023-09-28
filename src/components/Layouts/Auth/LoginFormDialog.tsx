import type { TransitionProps } from '@mui/material/transitions/transition'

import { FC, forwardRef, FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'

import LoadingButton from '@mui/lab/LoadingButton'

import LogoutIcon from '@mui/icons-material/Logout'

import Dialog from '@/components/Global/Dialog'
import useAuth from '@/providers/Auth'
import useValidationErrors from '@/hooks/useValidationErrors'

const LoginFormDialog: FC = () => {
    const router = useRouter()
    const { isAuthenticated, user, onLoginSuccess } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const { validationErrors, setValidationErrors, clearByEvent } =
        useValidationErrors()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget
        if (!formEl.checkValidity()) {
            return formEl.reportValidity()
        }

        const formData = new FormData(formEl)

        setIsLoading(true)

        await axios
            .post(`/relogin/${user?.uuid}`, formData)
            .then(res => res.data)
            .then(onLoginSuccess)
            .then(router.reload)
            .catch(err => {
                if (err.response) {
                    const { data } = err.response
                    if (data.errors) {
                        setValidationErrors(data.errors)
                    }
                }

                setIsLoading(false)
            })
    }

    return (
        <Dialog
            dialogTitleProps={{
                color: 'warning.main',
            }}
            title={'Sesi anda telah berakhir'}
            open={!isAuthenticated && !!user && location.pathname !== '/logout'}
            TransitionComponent={Transition}>
            Halo{' '}
            <Box color="info.main" component="b">
                {user?.name}
            </Box>
            , Silahkan login kembali untuk melanjutkan sesi anda.
            <form autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    disabled={isLoading}
                    label="Email"
                    name="email"
                    variant="outlined"
                    margin="normal"
                    autoComplete="off"
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    disabled={isLoading}
                    autoComplete="off"
                    fullWidth
                    onChange={clearByEvent}
                    type="password"
                    name="password"
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                />

                <FormControlLabel
                    name="remember"
                    disabled={isLoading}
                    control={<Checkbox value="true" color="primary" />}
                    label="Remember me"
                />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                    }}>
                    <Button
                        disabled={isLoading}
                        href="/logout"
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<LogoutIcon />}>
                        Logout saja
                    </Button>

                    <LoadingButton
                        loading={isLoading}
                        variant="contained"
                        color="info"
                        type="submit">
                        Login
                    </LoadingButton>
                </Box>
            </form>
        </Dialog>
    )
}

export default LoginFormDialog

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})
