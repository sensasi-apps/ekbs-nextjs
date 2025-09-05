import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'
import KeyIcon from '@mui/icons-material/Key'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import CompleteCenter from '@/components/Statuses/CompleteCenter'
import ErrorCenter from '@/components/Statuses/ErrorCenter'
import axios from '@/lib/axios'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
import type UserORM from '../types/orms/user'
import handle422 from '@/utils/handle-422'

const EMPTY_PASSWORDS_DATA = {
    new_password: '',
    new_password_confirmation: '',
}

export default function SetPasswordButtonAndDialogForm({
    data: user,
}: {
    data: UserORM
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [validationErrors, setValidationErrors] = useState<
        LaravelValidationExceptionResponse['errors']
    >({})

    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const [passwordsData, setPasswordsData] = useState(EMPTY_PASSWORDS_DATA)

    useEffect(() => {
        if (isOpen === false) {
            setValidationErrors({})
            setIsComplete(false)
            setIsLoading(false)
            setError(undefined)
            setPasswordsData(EMPTY_PASSWORDS_DATA)
        }
    }, [isOpen])

    if (!user) return null

    const isSubmitDisabled = () =>
        validationErrors.new_password !== undefined ||
        validationErrors.new_password_confirmation !== undefined ||
        isLoading ||
        passwordsData.new_password === '' ||
        passwordsData.new_password_confirmation === ''

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        setIsLoading(true)

        axios
            .put(`/users/${user.uuid}/set-password`, passwordsData)
            .catch(error => handle422(error, setValidationErrors))
            .then(() => setIsComplete(true))
            .finally(() => {
                setIsLoading(false)
            })
    }

    const validateInputs = (name: string, value: string) => {
        let error = undefined

        if (value.length !== 0 && value.length < 8) {
            error = 'Kata sandi minimal 8 karakter'
        }

        if (
            name === 'new_password_confirmation' &&
            value !== passwordsData.new_password
        ) {
            error = 'Kata sandi tidak sama'
        }

        if (error) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: [error],
            }))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        validateInputs(name, value)

        setPasswordsData({
            ...passwordsData,
            [name]: value,
        })
    }

    return (
        <>
            <Button
                disabled={!user?.uuid || user.is_active === false}
                variant="outlined"
                color="warning"
                size="small"
                startIcon={<KeyIcon />}
                onClick={() => setIsOpen(true)}>
                Atur kata sandi
            </Button>

            <Dialog
                fullWidth
                maxWidth="xs"
                open={isOpen}
                onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}>
                <DialogContent>
                    <Box display="flex" mb={1.5} alignItems="center">
                        <KeyIcon color="warning" />
                        <Typography
                            variant="h6"
                            component="h2"
                            ml={1}
                            flexGrow={1}>
                            Pengaturan kata sandi
                        </Typography>

                        <IconButton
                            disabled={isLoading}
                            onClick={() => setIsOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <CompleteCenter
                        isShow={isComplete}
                        message={`Kata sandi akun ${user.name} berhasil diubah`}
                    />

                    <LoadingCenter isShow={isLoading} />

                    <ErrorCenter
                        isShow={error !== undefined}
                        message={error}
                        onClose={() => setError(undefined)}
                    />

                    <Box
                        sx={{
                            display:
                                isComplete || isLoading || error
                                    ? 'none'
                                    : 'block',
                        }}>
                        <DialogContentText>
                            Pastikan Anda mengatur kata sandi yang aman untuk
                            akun <strong>{user.name}</strong>.
                        </DialogContentText>
                        <form id="set_password_form" onSubmit={handleSubmit}>
                            <TextField
                                margin="dense"
                                name="new_password"
                                label="Kata sandi baru"
                                type="password"
                                fullWidth
                                onChange={handleChange}
                                error={Boolean(validationErrors.new_password)}
                                helperText={validationErrors.new_password}
                            />

                            <TextField
                                margin="dense"
                                name="new_password_confirmation"
                                label="Ulangi kata sandi baru"
                                type="password"
                                fullWidth
                                onChange={handleChange}
                                error={Boolean(
                                    validationErrors.new_password_confirmation,
                                )}
                                helperText={
                                    validationErrors.new_password_confirmation
                                }
                            />
                        </form>
                    </Box>
                </DialogContent>

                {!isComplete && (
                    <DialogActions>
                        <Button
                            color="warning"
                            disabled={isSubmitDisabled()}
                            type="submit"
                            form="set_password_form">
                            Simpan
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    )
}
