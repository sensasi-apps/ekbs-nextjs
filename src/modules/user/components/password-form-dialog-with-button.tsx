import CloseIcon from '@mui/icons-material/Close'
import KeyIcon from '@mui/icons-material/Key'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import CompleteCenter from '@/components/statuses/complete-center'
import ErrorCenter from '@/components/statuses/error-center'
import LoadingCenter from '@/components/statuses/loading-center'
import axios from '@/lib/axios'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
import handle422 from '@/utils/handle-422'
import type UserORM from '../types/orms/user'

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
                color="warning"
                disabled={!user?.uuid || user.is_active === false}
                onClick={() => setIsOpen(true)}
                size="small"
                startIcon={<KeyIcon />}
                variant="outlined">
                Atur kata sandi
            </Button>

            <Dialog
                fullWidth
                maxWidth="xs"
                onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}
                open={isOpen}>
                <DialogContent>
                    <Box alignItems="center" display="flex" mb={1.5}>
                        <KeyIcon color="warning" />
                        <Typography
                            component="h2"
                            flexGrow={1}
                            ml={1}
                            variant="h6">
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
                                error={Boolean(validationErrors.new_password)}
                                fullWidth
                                helperText={validationErrors.new_password}
                                label="Kata sandi baru"
                                margin="dense"
                                name="new_password"
                                onChange={handleChange}
                                type="password"
                            />

                            <TextField
                                error={Boolean(
                                    validationErrors.new_password_confirmation,
                                )}
                                fullWidth
                                helperText={
                                    validationErrors.new_password_confirmation
                                }
                                label="Ulangi kata sandi baru"
                                margin="dense"
                                name="new_password_confirmation"
                                onChange={handleChange}
                                type="password"
                            />
                        </form>
                    </Box>
                </DialogContent>

                {!isComplete && (
                    <DialogActions>
                        <Button
                            color="warning"
                            disabled={isSubmitDisabled()}
                            form="set_password_form"
                            type="submit">
                            Simpan
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    )
}
